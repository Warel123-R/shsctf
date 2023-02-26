import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import { UserContext } from "../providers/UserProvider";
import { GlobalContext } from "../providers/GlobalProvider";
import { LeaderboardContext } from "../providers/LeaderboardProvider";

const useStyles = makeStyles({
  score: {
    fontSize: "80px",
  },
  depositContext: {
    flex: 1,
  },
});

export default function Score() {
  const classes = useStyles();
  const userState = useContext(UserContext);
  const data = useContext(GlobalContext).data;
  const leaderboardState = useContext(LeaderboardContext);
  const score = leaderboardState.users[userState.user.uid].score;
  return (
    <React.Fragment>
      <Title>Your Score</Title>
      <Typography component="p" variant="h1" className={classes.score}>
        {score}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        of {data.maxScore} possible points
      </Typography>
      <div>
        <Link
          color="primary"
          variant="body2"
          component={RouterLink}
          to="/leaderboard"
        >
          View leaderboard
        </Link>
      </div>
    </React.Fragment>
  );
}
