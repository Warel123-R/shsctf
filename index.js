const admin = require("firebase-admin");
const http = require("http");
const fieldValue = admin.firestore.FieldValue;

var serviceAccount = require("./keys/shs-ctf-firebase-adminsdk-o68dw-cb950d3896.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://shs-ctf.firebaseio.com"
});

let db = admin.firestore();

let challenges = {};
let flags = {};

function success(uid, submission, s) {
  console.log("Successful submission by user " + uid + " for problem " + s.problem);
  db.collection("leaderboard").doc(uid).get().then((leaderboardDoc)=>{
    if (leaderboardDoc.data()["solvedChallenges"].some(e => e===s.problem)) {
      return;
    }
  if (s.problem in challenges) {
    let data = challenges[s.problem];
    db.collection("leaderboard").doc(uid).update({
      score: fieldValue.increment(data.points),
      solvedChallenges: fieldValue.arrayUnion({ name: s.problem, timestamp: admin.firestore.Timestamp.now()})
    });
  } else {
    db.collection("globals/data/challenges").doc(s.problem).get().then((challengeDoc) => {
      let data = challengeDoc.data();
      challenges[s.problem] = data;
      db.collection("leaderboard").doc(uid).update({
        score: fieldValue.increment(data.points),
        solvedChallenges: fieldValue.arrayUnion({ name: s.problem, timestamp: admin.firestore.Timestamp.now()})
      });
    });
  }
  });
  db.collection("users/" + uid + "/submissions").doc(submission).set({
    success: true,
    name: s.problem,
    timestamp: admin.firestore.Timestamp.now()
  });
}

function fail(uid, submission, s) {
  console.log("Failed submission by user " + uid + " for problem " + s.problem);

    db.collection("users/" + uid + "/submissions").doc(submission).set({
      success: false,
      name: s.problem,
      timestamp: admin.firestore.Timestamp.now()
    });
}

db.collection("submissions").onSnapshot(querySnapshot => {
  querySnapshot.docChanges().forEach(change => {
          let doc = change.doc;
          let data = doc.data();
          for (let submission in data) {
            let s = data[submission];
            if (s.problem in flags) {
              let data = flags[s.problem];
              if (data.flag === s.flag) {
                success(doc.id, submission, s);
              } else {
                fail(doc.id, submission, s);
              }
            } else {
              db.collection("flags").doc(s.problem).get().then((flagDoc)=>{
                flags[s.problem] = flagDoc.data();
                if (flagDoc.data().flag === s.flag) {
                  success(doc.id, submission, s);
                } else {
                  fail(doc.id, submission, s);
                }
              });
            }
            let updateMap = {};
            updateMap[submission] = fieldValue.delete();
            db.collection("submissions").doc(doc.id).update(updateMap);
          }
        });
});

db.collection("users").onSnapshot(querySnapshot => {
  querySnapshot.docChanges().forEach(change => {
          if (change.type !== "added") {
            return;
          }
          let data = change.doc.data();
          db.collection("leaderboard").doc(change.doc.id).get().then((doc)=>{
            if (doc && doc.exists) {
              return;
            }
            db.collection("leaderboard").doc(change.doc.id).set({
              username: data.username,
              score: 0,
              solvedChallenges: []
            }, { merge: true });
          });
  });
});

db.collection("globals/data/challenges").onSnapshot(querySnapshot => {
  let maxScore = 0;
  querySnapshot.docs.forEach(doc => {
    maxScore += doc.data().points;
  });
  db.collection("globals").doc("data").set({
    maxScore: maxScore
  });
});

const hostname = '0.0.0.0';
const port = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});