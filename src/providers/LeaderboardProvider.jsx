import React, { Component, createContext } from "react";
import { db } from "../services/firebase";
import { UserContext } from "./UserProvider";

export const LeaderboardContext = createContext({ users: {} });

class LeaderboardProvider extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      users: {},
      solved: new Set(),
      leaderboardLoaded: false,
    };
  }
  componentDidMount() {
    db.collection("leaderboard").onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        let doc = change.doc;
        let data = doc.data();
        this.setState((state) => {
          state.users[doc.id] = data;
          let uid = this.context.user.uid;
          if (uid === doc.id) {
            state.solved = new Set(
              this.state.users[this.context.user.uid].solvedChallenges.map(
                (challenge) => {
                  return challenge.name;
                }
              )
            );
            state.leaderboardLoaded = true;
          }
          return state;
        });
      });
    });
  }

  render() {
    return (
      <LeaderboardContext.Provider value={this.state}>
        {this.props.children}
      </LeaderboardContext.Provider>
    );
  }
}

export default LeaderboardProvider;
