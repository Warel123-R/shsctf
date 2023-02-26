import React, { useContext } from "react";
import { UserContext } from "../providers/UserProvider";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Route, Link, useLocation } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { homeItems } from "../data/homeItems";
import { signOut } from "../services/firebase";
import Box from "@material-ui/core/Box";
import Copyright from "../components/Copyright";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  mobileToolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: "#000",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  mobileAppBar: {
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  mobileAppBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    textAlign: "left",
    flexGrow: 1,
  },
  name: {
    textAlign: "right",
    flexGrow: 1,
  },
  desktopOnly: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  mobileOnly: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawerPaper: {
    position: "relative",
    marginLeft: 0,
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
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
}));

export default function Home() {
  const currPath = useLocation().pathname;
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const userState = useContext(UserContext);
  let data = userState.doc.data();
  const displayName = data.username;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Stevenson CTF
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={clsx(classes.name, classes.desktopOnly)}
          >
            {displayName}
          </Typography>
          <IconButton
            color="inherit"
            onClick={signOut}
            className={classes.desktopOnly}
          >
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <div>
            {homeItems.map(({ name, path, icon, component, props }) => (
              <ListItem
                key={path}
                button
                component={Link}
                to={path}
                selected={currPath === path}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </div>
        </List>
      </Drawer>
      <main className={clsx(classes.content, open && classes.contentShift)}>
        <div className={classes.appBarSpacer} />
        <Toolbar className={clsx(classes.mobileToolbar, classes.mobileOnly)}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.name}
          >
            {displayName}
          </Typography>
          <IconButton color="inherit" onClick={signOut}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
        {homeItems.map(({ name, path, icon, Component, props }) => (
          <Route key={path} exact path={path}>
            <Component {...props} />
            <Box pt={4}>
              <Copyright />
            </Box>
          </Route>
        ))}
      </main>
    </div>
  );
}
