import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Title from "./Title";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import DirectionsIcon from "@material-ui/icons/Directions";
import CheckCircleIcon from "@material-ui/icons/CheckCircleOutline";
import { CircularProgress } from "@material-ui/core";
import { UserContext } from "../providers/UserProvider";
import { db, submitFlag } from "../services/firebase";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  loader: {
    margin: theme.spacing(1),
  },
  root: {
    padding: "2px 4px",
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#eeeeee",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: '#000'
  },
  iconButton: {
    padding: 10,
  },
}));

function RelevantLinks({ links }) {
  if (links) {
    return (
      <Typography variant="body1">
        Relevant links:{" "}
        {links.map((link, index) => {
          let comma = ", ";
          if (index === links.length - 1) {
            comma = "";
          }
          console.log(link.url);
          return (
            <React.Fragment>
              <Link component="a" key={index} href={link.url}>
                
                {link.link}
              </Link>
              {comma}
            </React.Fragment>
          );
        })}
      </Typography>
    );
  }
  return <div />;
}

export default function Challenge({
  name,
  statement,
  links,
  points,
  solved,
  onSuccess,
  onFail,
}) {
  const classes = useStyles();
  const user = useContext(UserContext).user;
  const [value, setValue] = useState("");
  const [waiting, setWaiting] = useState(false);
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const handleSubmit = (event, user, problem, flag) => {
    event.preventDefault();
    submitFlag(user, problem, flag);
    setValue("");
    setWaiting(true);
    let path = `users/${user.uid}/submissions`;
    db.collection(path)
      .doc(problem)
      .onSnapshot((doc) => {
        if (doc && doc.exists) {
          setTimeout(() => {
            setWaiting(false);
          }, 150);
          if (doc.data().success) {
            onSuccess(name);
          } else {
            onFail(name);
          }
          db.collection(path).doc(problem).delete();
          db.collection(path)
            .doc(problem)
            .onSnapshot(() => {});
        }
      });
  };
  if (solved) {
    return (
      <Grid item xs={12}>
        <Paper
          className={classes.paper}
          style={{ textAlign: "left", backgroundColor: "#fff" }}
        >
          <Grid container spacing={3} justify={"center"}>
            <Grid item xs={12} lg={11}>
              <Title>
                {name} ({points} Points)
              </Title>
              <Typography variant="body1">{statement}</Typography>
              <RelevantLinks links={links} />
            </Grid>
            <Grid item xs={12} lg={1}>
              <CheckCircleIcon color="secondary" style={{ fontSize: "60px" }} />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  } else {
    return (
      <Grid item xs={12}>
        <Paper className={classes.paper} style={{ textAlign: "left" }}>
          <Title>
            {name} ({points} Points)
          </Title>
          <Typography variant="body1">{statement}</Typography>
          <RelevantLinks links={links} />
          {waiting ? (
            <CircularProgress className={classes.loader} />
          ) : (
            <form
              onSubmit={(event) => handleSubmit(event, user, name, value)}
              className={classes.root}
            >
              <InputBase
                className={classes.input}
                placeholder="Enter flag: shsctf{...}"
                inputProps={{ "aria-label": "flag" }}
                onChange={handleChange}
                value={value}
              />
              <IconButton
                color="primary"
                type="submit"
                className={classes.iconButton}
                aria-label="directions"
              >
                <DirectionsIcon />
              </IconButton>
            </form>
          )}
        </Paper>
      </Grid>
    );
  }
}
