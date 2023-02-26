import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Chart from "./Chart";
import Deposits from "./Score";
import SolvedChallenges from "./SolvedChallenges";
import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { CircularProgress } from "@material-ui/core";
import { LeaderboardContext } from "../providers/LeaderboardProvider";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  loader: {
    marginTop: theme.spacing(4),
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const leaderboardState = useContext(LeaderboardContext);
  const challengesLoaded = leaderboardState.leaderboardLoaded;
  if (!challengesLoaded) {
    return (
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} justify={"center"}>
          <CircularProgress />
        </Grid>
      </Container>
    );
  } else {
    return (
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={fixedHeightPaper}>
              <Chart />
            </Paper>
          </Grid>
          {/* Recent Score */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper className={fixedHeightPaper}>
              <Deposits />
            </Paper>
          </Grid>
          {/* Recent SolvedChallenges */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <SolvedChallenges />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}
