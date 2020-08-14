import React, { useRef, useReducer, useEffect, useCallback } from "react";
import { ThemeProvider as MultiThemeProvider } from "@material-ui/core/styles";
import cryptoRandomString from "crypto-random-string";
import { Typography, TextField } from "@material-ui/core";
import theme from "../styles/theme";

import Header from "../components/Header";
import Message from "../components/Message";

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
  };

  const isTyping = useRef(false);
  const messagesEnd = useRef(null);

  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);

  const handleRoomCode = useCallback(() => {
    const query = props.location.search.substr(1);

    const idForUser = cryptoRandomString({ length: 10, type: "url-safe" });

    props.socket.emit("joinRoom", { code: query, userId: idForUser });
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

  const inviteHandler = () => {};

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
    if (props.userMessage !== "") {
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
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    socketCommands();
    handleRoomCode();
  }, [handleRoomCode, socketCommands]);

  return (
    <MultiThemeProvider theme={theme}>
      {state.hasJoined ? (
        <Header
          users={state.users}
          onLeave={roomLeaveHander}
          onInvite={inviteHandler}
        />
      ) : (
        <Header />
      )}

      <div className="scenario-container">
        {state.messages.map((message, index) => (
          <Message
            msg={message}
            key={index}
            isSent={message.userId === state.userId}
          />
        ))}
      </div>

      <div>
        <Typography color="primary">{state.typingMessage}</Typography>
      </div>
      <TextField
        variant="outlined"
        onChange={onMessageChange}
        placeholder="type something here"
        autoFocus={true}
        style={{ marginTop: 20, width: "90%", marginLeft: 20 }}
        value={state.userMessage}
        onKeyPress={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
      />
      <div style={{ float: "left", clear: "both" }} ref={messagesEnd}></div>
    </MultiThemeProvider>
  );
};

export default Room;
