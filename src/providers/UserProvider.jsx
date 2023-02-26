import React, { Component, createContext } from "react";
import { auth, db } from "../services/firebase";
import { Route, Redirect } from "react-router-dom";
import Loading from "../components/Loading";
import { GlobalContext } from "./GlobalProvider";

export const UserContext = createContext({ user: null, doc: null });

class UserProvider extends Component {
  static contextType = GlobalContext;

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      doc: null,
    };
  }
  componentDidMount() {
    auth.onAuthStateChanged((userAuth) => {
      this.setState({ user: userAuth });
      if (userAuth) {
        db.collection("users")
          .doc(userAuth.uid)
          .onSnapshot((doc) => {
            this.setState({ doc: doc });
          });
      }
    });
  }

  render() {
    if (this.state.user) {
      if (this.state.doc && this.state.doc.exists) {
        if (this.context.data) {
          return (
            <React.Fragment>
              <Route key="/signin" exact path="/signin">
                <Redirect to="/dashboard" />
              </Route>
              <Route key="/register" exact path="/register">
                <Redirect to="/dashboard" />
              </Route>
              <Route key="/" path="/">
                <UserContext.Provider value={this.state}>
                  {this.props.children}
                </UserContext.Provider>
              </Route>
            </React.Fragment>
          );
        } else {
          return <Loading timeout={3500} />;
        }
      }
      return (
        <UserContext.Provider value={this.state}>
          <Loading timeout={3500}>
            <Route key="/register" exact path="/register">
              {this.props.children}
            </Route>
            <Route key="/" path="/">
              <Redirect to="/register" />
            </Route>
          </Loading>
        </UserContext.Provider>
      );
    } else {
      return (
        <UserContext.Provider value={this.state}>
          <Loading timeout={3500}>
            <Route key="/signin" exact path="/signin">
              {this.props.children}
            </Route>
            <Route key="/" path="/">
              <Redirect to="/signin" />
            </Route>
          </Loading>
        </UserContext.Provider>
      );
    }
  }
}

export default UserProvider;
