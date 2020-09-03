import React, { useRef, useReducer, useEffect, useCallback } from "react";
import {
  ThemeProvider as MultiThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import cryptoRandomString from "crypto-random-string";
import { Typography, TextField, Modal, Button } from "@material-ui/core";
import theme from "../styles/theme";

import copy from "copy-to-clipboard";

import Header from "../components/Header";
import Message from "../components/Message";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: "center",
  },
  modalButtons: {
    display: "flex",
    flexDirection: "column",
    height: 80,
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    position: "fixed",
    marginTop: 30,
    bottom: 0,
    marginBottom: 20,
    width: "100%",
    marginLeft: 20,
    backgroundColor: "white",
  },
  chatText: {
    width: "90%",
    position: "relative",
  },
  scenarioContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "75px",
    maxHeight: "80%",
    marginBottom: "75px",
    overflow: "auto",
  },
  noRoom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
}));

const Room = (props) => {
  const initialState = {
    hasJoined: false,
    roomCode: "",
    roomTopic: "",
    users: "",
    messages: [],
    userMessage: "",
    userId: "",
    typingMessage: "",
    errorMessage: "",
    modalOpen: false,
  };

  const isTyping = useRef(false);
  const messagesEnd = useRef(null);

  const classes = useStyles();

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const handleRoomCode = useCallback(() => {
    //const query = props.location.search.substr(1);
    const query = new URLSearchParams(props.location.search);
    let roomCode = "";
    for (let param of query.entries()) {
      if (param[0] === "code") {
        roomCode = param[1];
      }
    }

    const idForUser = cryptoRandomString({ length: 10, type: "url-safe" });

    props.socket.emit("joinRoom", { code: roomCode, userId: idForUser });
  }, [props]);

  const roomJoinedHandler = useCallback(
    (response) => {
      setState({
        hasJoined: true,
        roomCode: response.room.code,
        roomTopic: response.room.topic,
        userId: response.userId,
        users: response.room.users.toString(),
      });

      let newMessages = state.messages;
      newMessages.push(response.admin);
      setState({ messages: newMessages });
    },
    [state.messages]
  );

  const failedJoinHandler = useCallback((error) => {
    setState({ hasJoined: false, errorMessage: error.message });
  }, []);

  const roomLeftHandler = useCallback(() => {
    props.history.push("/");
  }, [props.history]);

  const userUpdateHandler = useCallback(
    (response) => {
      let newMessages = state.messages;
      newMessages.push(response.admin);
      setState({ messages: newMessages, users: response.userCount });
    },
    [state.messages]
  );

  const roomLeaveHander = () => {
    console.log("LEFT");
    props.socket.emit("leaveRoom");
  };

  const onMessageChange = (e) => {
    setState({ userMessage: e.target.value });

    if (isTyping.current === false) {
      isTyping.current = true;
      props.socket.emit("typing", { isTyping: true }, (err) => {});
    } else {
      if (e.target.value === "") {
        isTyping.current = false;
        props.socket.emit("typing", { isTyping: false }, (err) => {});
      }
    }
  };

  // enter key handler to send message
  const handleSendMessage = (e) => {
    if (state.userMessage !== "") {
      props.socket.emit("message", { text: state.userMessage }, (err) => {});
      props.socket.emit("typing", { isTyping: false }, (err) => {});
      setState({ isTyping: false, userMessage: "" });
    }
  };

  const newMessageHandler = useCallback(
    (message) => {
      let newMessages = state.messages;
      newMessages.push(message);
      setState({ messages: newMessages });
    },
    [state.messages]
  );

  const someoneTypingHandler = useCallback((typing) => {
    let count = typing.count;
    let typeMessage = "";

    if (isTyping.current === true) count--;

    if (count > 0) {
      if (count === 1) typeMessage = "Someone is typing...";
      else typeMessage = `${count} people are typing...`;
    }

    setState({ typingMessage: typeMessage });
  }, []);

  const openModalHandler = () => {
    setState({ modalOpen: true });
  };

  const closeModalHandler = () => {
    setState({ modalOpen: false });
  };

  const inviteEmail = () => {
    const link = window.location.href;
    const subject = encodeURI("Chatnonymous Room Invite");
    const body = encodeURI(
      `You have been invited to a Chatnonmyous Room with the topic: ${state.roomTopic}\n\nClick the following link to enter the room:\n${link}\n\nFrom,\nChatnonymous Team`
    );
    const mail = `mailto:?subject=${subject}&body=${body}`;

    window.open(mail);
  };

  const copyLink = () => {
    const link = window.location.href;
    copy(link);
  };

  const socketCommands = useCallback(() => {
    props.socket.on("roomJoined", roomJoinedHandler);
    props.socket.on("failedJoined", failedJoinHandler);
    props.socket.on("roomLeft", roomLeftHandler);
    props.socket.on("onTyping", someoneTypingHandler);
    props.socket.on("newmessage", newMessageHandler);
    props.socket.on("onUserJoin", userUpdateHandler);
    props.socket.on("userLeft", userUpdateHandler);
  }, [
    roomJoinedHandler,
    failedJoinHandler,
    roomLeftHandler,
    someoneTypingHandler,
    newMessageHandler,
    userUpdateHandler,
    props.socket,
  ]);

  useEffect(() => {
    if (state.hasJoined)
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    socketCommands();
    handleRoomCode();
  }, [handleRoomCode, socketCommands]);

  return (
    <MultiThemeProvider theme={theme}>
      {state.hasJoined ? (
        <React.Fragment>
          <Header
            users={state.users}
            onLeave={roomLeaveHander}
            onOpenModal={openModalHandler}
          />
          <div className={classes.scenarioContainer}>
            {state.messages.map((message, index) => (
              <Message
                msg={message}
                key={index}
                isSent={message.userId === state.userId}
              />
            ))}
          </div>
          <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
          <div>
            <Typography color='primary'>{state.typingMessage}</Typography>
          </div>
          <div className={classes.inputContainer}>
            <TextField
              variant='outlined'
              onChange={onMessageChange}
              placeholder='type something here'
              autoFocus={true}
              className={classes.chatText}
              value={state.userMessage}
              onKeyPress={(e) =>
                e.key === "Enter" ? handleSendMessage() : null
              }
            />
          </div>

          <Modal
            open={state.modalOpen}
            onClose={closeModalHandler}
            className={classes.modal}
          >
            <div className={classes.paper}>
              <h2>Room Code {state.roomCode}</h2>
              <p>{window.location.href}</p>
              <div className={classes.modalButtons}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => inviteEmail()}
                >
                  Email Link
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => copyLink()}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </Modal>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Header />
          <div className={classes.noRoom}>
            <h2>No Room Found</h2>
            <h3>Make sure you enter in the correct Room Code.</h3>
          </div>
        </React.Fragment>
      )}
    </MultiThemeProvider>
  );
};

export default Room;
