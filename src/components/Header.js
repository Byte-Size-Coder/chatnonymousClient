import React, { Fragment } from "react";
import { ThemeProvider as MultiThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Tooltip } from "@material-ui/core";
import theme from "../styles/theme";

import chatIcon from "../images/Chatnonymous_Icon.png";
import chatText from "../images/Chatnonymous_Text.png";

import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  topicTitle: {
    flexGrow: 3,
    textAlign: "center",
  },
  userTitle: {
    flexGrow: 1,
    textAlign: "end",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100px",
  },
  text: {
    marginLeft: "10px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const Header = (props) => {
  const classes = useStyles();

  let users = undefined;
  let buttons = undefined;
  let headerPos = "static";

  if (props.users && props.users !== "") {
    users = <h4 className={classes.userTitle}>Users: {props.users}</h4>;
    buttons = (
      <Fragment>
        <Tooltip title='Invite User' aria-label='invite-user'>
          <IconButton
            edge='end'
            color='inherit'
            onClick={() => props.onOpenModal()}
          >
            <PersonAddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title='Leave Room' aria-label='leave-room'>
          <IconButton
            edge='end'
            color='inherit'
            onClick={() => props.onLeave()}
          >
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </Fragment>
    );
    headerPos = "fixed";
  }

  return (
    <MultiThemeProvider theme={theme}>
      <AppBar position={headerPos}>
        <Toolbar>
          <img src={chatIcon} height='30px' alt='Chatnonymous Icon' />
          <img
            src={chatText}
            height='30px'
            alt='Chatnonymous Text'
            className={classes.text}
          />
          {users}
          {buttons}
        </Toolbar>
      </AppBar>
    </MultiThemeProvider>
  );
};

export default Header;
