import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtKsCrs0bEvrOo2Kn_oje6hdEPFCeujLc",
  authDomain: "quick-filament-262202.firebaseapp.com",
  projectId: "quick-filament-262202",
  storageBucket: "quick-filament-262202.appspot.com",
  messagingSenderId: "6526243120",
  appId: "1:893311515883:web:506cbf42281f0c0d8052ae",
  measurementId: "G-5107HV380P",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

export const getBot = () => {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "https://quick-filament-262202.herokuapp.com/", true);
  xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlHttp.send(null);
  xmlHttp.open("POST", "https://quick-filament-262202.herokuapp.com/", true);
  xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlHttp.send(null);
};

export const signInWithGoogle = () => {
  getBot();
  auth.signInWithRedirect(provider);
};

export const signOut = () => {
  auth
    .signOut()
    .then(function () {
      // Sign-out successful.
    })
    .catch(function (error) {
      // An error happened.
    });
};

export const addUser = (user, username, emailList) => {
  getBot();
  db.collection("users").doc(user.uid).set({
    username: username,
    fullName: user.displayName,
    emailList: emailList,
    createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
  db.collection("submissions").doc(user.uid).set({});
};

export const submitFlag = (user, problem, flag) => {
  getBot();
  let updateMap = {};
  updateMap[problem] = {
    problem: problem,
    flag: flag,
  };
  db.collection("submissions").doc(user.uid).update(updateMap);
};


export const getVideos = () => db.collection('videos').get();