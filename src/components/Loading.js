import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "../components/Copyright";
import { CircularProgress } from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";
import Title from "./Title";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Loading({ timeout, children }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  if (loading) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <FlagIcon />
          </Avatar>
          <Container maxWidth="lg" className={classes.container} >
            <Title>
                Stevenson CTF
                </Title>
            
        </Container>
          <CircularProgress className={classes.submit} />
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  } else {
    return children;
  }
}
