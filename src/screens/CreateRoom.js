import React, { useState, useEffect, Fragment } from "react";
import cryptoRandomString from "crypto-random-string";
import { ThemeProvider as MultiThemeProvider } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@material-ui/core";
import theme from "../styles/theme";

import Header from "../components/Header";

import chatDark from "../images/Chatnonymous_Dark.png";

const CreateRoom = (props) => {
  const [roomCode, setRoomCode] = useState("");
  const [roomTopic, setRoomTopic] = useState("");

  useEffect(() => {
    // connect to server
    generateRoomCode();
  }, []);

  const onRoomTopicChange = (e) => {
    setRoomTopic(e.target.value);
  };

  const generateRoomCode = () => {
    setRoomCode(cryptoRandomString({ length: 10, type: "url-safe" }));
  };

  const handleGenerateRoom = () => {
    const roomQuery = encodeURIComponent(`${roomCode}`);
    props.socket.emit("createRoom", {
      code: roomCode,
      topic: roomTopic,
    });
    props.history.push(`/room?${roomQuery}`);
  };

  return (
    <MultiThemeProvider theme={theme}>
      <Fragment>
        <Header />
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
                  alt="Chatnonymous Logo"
                />
                <Grid container justify="center">
                  <Grid item xs={6} sm={4}>
                    <h2>Your room code is</h2>
                    <h3>{roomCode}</h3>
                  </Grid>
                </Grid>
                <Grid container justify="center">
                  <Grid item xs={6} sm={4}>
                    <TextField
                      onChange={onRoomTopicChange}
                      value={roomTopic}
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
    </MultiThemeProvider>
  );
};

export default CreateRoom;
