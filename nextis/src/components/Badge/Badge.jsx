import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";

import badgeStyle from "assets/jss/material-dashboard-pro-react/components/badgeStyle.jsx";

function Badge({ ...props }) {
  const { classes, color, children, className } = props;
  return (
    <span className={classes.badge + " " + classes[color] + " " + className}>{children}</span>
  );
}

Badge.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "warning",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ])
};

export default withStyles(badgeStyle)(Badge);
