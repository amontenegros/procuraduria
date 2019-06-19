import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
  loader: {
    position: "fixed",
    zIndex: 99999,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "rgba(255,255,255,0.5)"
  },
  progressContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    width: 200,
    height: 52,
    textAlign: "center"
  },
  text: {
    marginBottom: 25,
    color: "#000"
  }
};

export const PageLoader = ({ show, classes, text }) =>
  show && (
    <div className={classes.loader}>
      <div className={classes.progressContainer}>
        <CircularProgress size={50} />
        {text && <div className={classes.text}>{text}</div>}
      </div>
    </div>
  );

PageLoader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PageLoader);
