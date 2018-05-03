import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

import typographyStyle from "assets/jss/material-dashboard-pro-react/components/typographyStyle.jsx";

function Muted({ ...props }) {
  const { classes, children } = props;
  return (
    <div className={classes.defaultFontStyle + " " + classes.mutedText}>
      {children}
    </div>
  );
}

Muted.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(typographyStyle)(Muted);
