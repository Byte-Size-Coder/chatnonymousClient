import React from "react";
import { Grid } from "@material-ui/core";
import "../App.css";

const Message = (props) => {
  let msg = props.msg;

  // check if it has been sent or recieve, add appropriate value to style
  let alignment = props.isSent ? "flex-end" : "flex-start";

  let admin = "";

  if (props.msg.admin) admin = "Admin Message";

  return (
    <Grid container justify={alignment}>
      <Grid item xs={8}>
        <div
          className="scenario-message"
          style={{
            backgroundColor: msg.colour,
          }}
        >
          {admin} @{msg.time}
          <br />
          <br />
          {msg.text}
        </div>
      </Grid>
    </Grid>
  );
};
export default Message;
