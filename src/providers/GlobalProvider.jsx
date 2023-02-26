import React, { Component, createContext } from "react";
import { db } from "../services/firebase";

export const GlobalContext = createContext({ data: null });

class GlobalProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      challenges: {},
    };
  }
  componentDidMount() {
    console.log("ComponentDidMount called");
    db.collection("globals")
      .doc("data")
      .get()
      .then((doc) => {
        this.setState({ data: doc.data() });
      });
    db.collection("challenges")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots

          this.setState((state) => {
            state.challenges[doc.id] = doc.data();
            return state;
          });
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }

  render() {
    return (
      <GlobalContext.Provider value={this.state}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

export default GlobalProvider;
