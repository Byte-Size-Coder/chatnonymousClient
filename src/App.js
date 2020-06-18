import React, { useReducer, useEffect, Fragment } from "react";
import io from "socket.io-client";
import cryptoRandomString from "crypto-random-string";
import MultiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import theme from "./styles/theme";

import chatIcon from "./images/Chatnonymous_Icon.png";
import chatDark from "./images/Chatnonymous_Dark.png";
import chatText from "./images/Chatnonymous_Text.png";

import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({}));

function App() {
  // styling
  const classes = useStyles();

  // state of app using reducer
  const initialState = {
    messages: [],
    inputMessage: "",
    roomStatus: "",
    roomCode: "",
    roomTopic: "",
    hasJoinedRoom: false,
    isCreateRoom: false,
    chatColour: "",
    typingMessage: "",
    isTyping: false,
    users: 0,
    openUsers: false,
    socket: undefined,
  };

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  useEffect(() => {
    // connect to server
    serverConnect();
  }, []);

  const serverConnect = () => {
    const socket = io.connect("localhost:5000", { forceNew: true });
  };

  const onRoomCodeChange = (e) => {
    setState({ roomCode: e.target.value });
  };

  const onRoomTopicChange = (e) => {
    setState({ roomTopic: e.target.value });
  };

  const handleRoomJoin = () => {};

  const handleRoomCreate = () => {
    setState({
      isCreateRoom: true,
      roomCode: cryptoRandomString({ length: 10, type: "url-safe" }),
    });
  };

  const handleGenerateRoom = () => {};

  return (
    <MultiThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <img src={chatIcon} height="30px" />
          <img src={chatText} height="30px" style={{ marginLeft: 5 }} />
          <IconButton edge="end" color="inherit" style={{ marginLeft: "auto" }}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {!state.hasJoinedRoom && !state.isCreateRoom && (
        <Grid container justify="center">
          <Grid item xs={10} sm={8} lg={6}>
            <Card style={{ marginTop: 20 }}>
              <CardHeader
                title="Room Control"
                color="inherit"
                style={{ textAlign: "center" }}
              />

              <CardContent style={{ textAlign: "center" }}>
                <img
                  src={chatDark}
                  style={{ maxWidth: "200px", marginBottom: 20 }}
                />
                <Grid container justify="center">
                  <Grid item xs={6} sm={4}>
                    <TextField
                      onChange={onRoomCodeChange}
                      value={state.roomCode}
                      placeholder="Enter Room Code"
                      autoFocus={true}
                      error={state.roomStatus !== ""}
                      helperText={state.roomStatus}
                    />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRoomJoin()}
                      disabled={state.roomCode === ""}
                    >
                      Join Room
                    </Button>
                  </Grid>
                </Grid>
                <Grid container justify="center" style={{ marginTop: 20 }}>
                  <Grid item xs={8} sm={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRoomCreate()}
                    >
                      Create New Room
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Grid container justify="center" style={{ marginTop: 20 }}>
              <Grid item xs={10} sm={8} style={{ textAlign: "center" }}>
                <h1> Welcome!</h1>
                <p>
                  Many people fear to voice themselves because they are judged
                  by who they are and what they say. This is found in many
                  scenarios, whether it be with an employer, a student, friends
                  or even family members.
                </p>
                <p>
                  Chatnonymous is an environment where people can share their
                  thoughts together without the concern of your identity
                  attached to these thoughts. This allows discussions to happen
                  at the clearest level so everyone in that environment can
                  comprehend and understand.
                </p>
                <p>
                  All conversations are contained within the room that you join
                  or create. No one outside of these rooms will ever have access
                  to or be able to see them.
                </p>
                <p>
                  None of your information or data is saved. There is no
                  identification while in a room conversation, only colours to
                  identify users when in a room.
                </p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      {state.isCreateRoom && (
        <Fragment>
          <Grid container justify="center">
            <Grid item xs={10} sm={8} lg={6}>
              <Card style={{ marginTop: 20 }}>
                <CardHeader
                  title="Create a Room"
                  color="inherit"
                  style={{ textAlign: "center" }}
                />
                <CardContent style={{ textAlign: "center" }}>
                  <img
                    src={chatDark}
                    style={{ maxWidth: "200px", marginBottom: 20 }}
                  />
                  <Grid container justify="center">
                    <Grid item xs={6} sm={4}>
                      <h2>Your room code is</h2>
                      <h3>{state.roomCode}</h3>
                    </Grid>
                  </Grid>
                  <Grid container justify="center">
                    <Grid item xs={6} sm={4}>
                      <TextField
                        onChange={onRoomTopicChange}
                        value={state.roomTopic}
                        placeholder="Enter your Room Topic"
                        fullWidth={true}
                      />
                    </Grid>
                  </Grid>
                  <Grid container justify="center" style={{ marginTop: 20 }}>
                    <Grid item xs={8} sm={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleGenerateRoom()}
                      >
                        Generate Room
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fragment>
      )}
      {/* {state.hasJoinedRoom && (
        
      )} */}
    </MultiThemeProvider>
  );
}

export default App;
