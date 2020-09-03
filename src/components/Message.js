import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  message: {
    color: "white",
    width: "80%",
    margin: "2px",
    padding: "1em",
    fontSize: "smaller",
    borderRadius: "10px",
    fontWeight: "bold",
  },
}));

const Message = (props) => {
  const classes = useStyles();

  let msg = props.msg;

  // check if it has been sent or recieve, add appropriate value to style
  let alignment = props.isSent ? "flex-end" : "flex-start";

  let admin = "";

  if (props.msg.admin) admin = "Admin Message";

  return (
    <Grid container justify={alignment}>
      <Grid item xs={8}>
        <div
          className={classes.message}
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
