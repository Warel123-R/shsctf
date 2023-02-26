import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { LeaderboardContext } from "../providers/LeaderboardProvider";
import Grid from "@material-ui/core/Grid";
import { CircularProgress } from "@material-ui/core";
import Videos from "./Videos";

// Generate Order Data
function createData(id, rank, name, score) {
  return { id, rank, name, score };
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Leaderboard() {
  const users = Object.values(useContext(LeaderboardContext).users);
  users.sort(function (x, y) {
    if (y.score === x.score && x.solvedChallenges.length > 0) {
      return x.solvedChallenges[x.solvedChallenges.length - 1].timestamp - y.solvedChallenges[y.solvedChallenges.length - 1].timestamp;
    }
    return y.score - x.score;
  });
  let rows = [];
  //let currScore = 1000000000;
  //let currRank = 0;
  users.forEach((user, index) => {
    /*
    if (user.score < currScore) {
      currRank += 1;
      currScore = user.score;
    }
    replace index+1 with currRank to have same rank with ties
    */
    rows.push(
      createData(index, index+1, user.username, user.score)
    );
  });
  rows = rows.slice(0, 15);
  const classes = useStyles();
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
  }
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Paper className={classes.paper}>
        <React.Fragment>
          <Title>Leaderboard</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Username</TableCell>
                <TableCell align="right">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.rank}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </React.Fragment>
      </Paper>
    </Container>
  );
}
