import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import io from "socket.io-client";

import Home from "./screens/Home";
import CreateRoom from "./screens/CreateRoom";
import Room from "./screens/Room";

//const socket = io.connect("localhost:5000", { forceNew: true });
const socket = io();

const App = () => {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path={process.env.PUBLIC_URL + "/"}
          render={(props) => <Home {...props} socket={socket} />}
        />
        <Route
          path={process.env.PUBLIC_URL + "/create-room"}
          render={(props) => <CreateRoom {...props} socket={socket} />}
        />
        <Route
          path={process.env.PUBLIC_URL + "/room"}
          render={(props) => <Room {...props} socket={socket} />}
        />
      </Switch>
    </Router>
  );
};

export default App;
