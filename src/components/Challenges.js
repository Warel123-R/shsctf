import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Challenge from "./Challenge";
import { GlobalContext } from "../providers/GlobalProvider";
import { CircularProgress } from "@material-ui/core";
import { LeaderboardContext } from "../providers/LeaderboardProvider";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

// Generate Order Data
function createData(name, statement, links, points, solved) {
  return { name, statement, links, points, solved };
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
  loader: {
    marginTop: theme.spacing(4),
  },
}));

export default function Challenges() {
  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);
  const addSnack = (message, type) => {
    setSnackPack((prev) => [
      ...prev,
      { message, type, key: new Date().getTime() },
    ]);
  };
  const addSuccess = (name) => {
    addSnack("Your flag for " + name + " was correct!", "success");
  };
  const addFail = (name) => {
    addSnack("Your flag for " + name + " was incorrect!", "error");
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };
  const classes = useStyles();
  const challenges = useContext(GlobalContext).challenges;
  const leaderboardState = useContext(LeaderboardContext);
  const challengesLoaded = leaderboardState.leaderboardLoaded;
  const solved = leaderboardState.solved;
  if (!challengesLoaded) {
    return (
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} justify={"center"}>
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  const rows = [];
  for (let name in challenges) {
    let c = challenges[name];
    rows.push(
      createData(name, c.statement, c.links, c.points, solved.has(name))
    );
  }
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3} justify={"center"}>
        {rows.map((row) => (
          <Challenge
            key={row.name}
            name={row.name}
            statement={row.statement}
            links={row.links}
            points={row.points}
            solved={row.solved}
            onSuccess={addSuccess}
            onFail={addFail}
          />
        ))}
      </Grid>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        onExited={handleExited}
      >
        <Alert
          onClose={handleClose}
          severity={messageInfo ? messageInfo.type : "error"}
        >
          {messageInfo ? messageInfo.message : undefined}
        </Alert>
      </Snackbar>
    </Container>
  );
}
