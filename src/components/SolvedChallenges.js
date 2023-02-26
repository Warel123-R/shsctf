import React, { useContext } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { UserContext } from "../providers/UserProvider";
import { Link as RouterLink } from "react-router-dom";
import { LeaderboardContext } from "../providers/LeaderboardProvider";
import { GlobalContext } from "../providers/GlobalProvider";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatTimestamp(timestamp) {
  let date = new Date(timestamp.seconds * 1000);
  return `${date.getDate()} ${
    monthNames[date.getMonth()]
  }, ${date.getFullYear()}`;
}

// Generate Order Data
function createData(name, timestamp, topic, points) {
  return { name, timestamp, topic, points };
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function SolvedChallenges() {
  const classes = useStyles();
  const globalState = useContext(GlobalContext);
  const userState = useContext(UserContext);
  const userChallenges = useContext(LeaderboardContext).users[
    userState.user.uid
  ].solvedChallenges;
  let data = [];
  userChallenges.forEach((challenge) => {
    if (challenge.name in globalState.challenges) {
      let c = globalState.challenges[challenge.name];
      data.push(
        createData(challenge.name, challenge.timestamp, c.topic, c.points)
      );
    }
  });
  let rows = data.reverse().slice(0, 10);

  return (
    <React.Fragment>
      <Title>Solved Challenges</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Topic</TableCell>
            <TableCell align="right">Points Earned</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{formatTimestamp(row.timestamp)}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.topic}</TableCell>
              <TableCell align="right">{row.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link
          color="primary"
          variant="body2"
          component={RouterLink}
          to="/challenges"
        >
          See more
        </Link>
      </div>
    </React.Fragment>
  );
}
