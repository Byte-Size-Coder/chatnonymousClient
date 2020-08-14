import React, { useState } from "react";
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

const Home = (props) => {
  const [code, setCode] = useState("");

  const onRoomCodeChange = (e) => {
    setCode(e.target.value);
  };

  const goToCreateRoom = () => {
    props.history.push("/create-room");
  };

  const handleRoomJoin = () => {
    const roomQuery = encodeURIComponent(`${code}`);
    props.history.push(`/room?${roomQuery}`);
  };

  return (
    <MultiThemeProvider theme={theme}>
      <Header />
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
                alt="Chatnonymous Logo"
              />
              <Grid container justify="center">
                <Grid item xs={6} sm={4}>
                  <TextField
                    onChange={onRoomCodeChange}
                    value={code}
                    placeholder="Enter Room Code"
                    autoFocus={true}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRoomJoin()}
                    disabled={code === ""}
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
                    onClick={() => goToCreateRoom()}
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
                Many people fear to voice themselves because they are judged by
                who they are and what they say. This is found in many scenarios,
                whether it be with an employer, a student, friends or even
                family members.
              </p>
              <p>
                Chatnonymous is an environment where people can share their
                thoughts together without the concern of your identity attached
                to these thoughts. This allows discussions to happen at the
                clearest level so everyone in that environment can comprehend
                and understand.
              </p>
              <p>
                All conversations are contained within the room that you join or
                create. No one outside of these rooms will ever have access to
                or be able to see them.
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
    </MultiThemeProvider>
  );
};

export default Home;
