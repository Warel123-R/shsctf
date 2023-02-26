import React from "react";
import "./App.css";
import "fontsource-roboto";
import { ThemeProvider } from "@material-ui/core/styles";

import theme from "./theme";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import UserProvider from "./providers/UserProvider";
import GlobalProvider from "./providers/GlobalProvider";
import LeaderboardProvider from "./providers/LeaderboardProvider";
import { getBot } from "./services/firebase";

function App() {
  const routes = [
    { path: ["/dashboard", "/challenges", "/leaderboard", "/learn"], Component: Home },
    { path: "/signin", Component: SignIn },
    { path: "/register", Component: Register },
  ];
  getBot();
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <Router>
            <GlobalProvider>
              <UserProvider>
                <LeaderboardProvider>
                  <Switch>
                    {routes.map(({ path, Component, props }) => (
                      <Route key={path} exact path={path}>
                        <Component {...props} />
                      </Route>
                    ))}
                    <Redirect to="/signin" />
                  </Switch>
                </LeaderboardProvider>
              </UserProvider>
            </GlobalProvider>
          </Router>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
