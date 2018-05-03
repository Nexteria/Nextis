import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import IconButton from "material-ui/IconButton";

import iconButtonStyle from "assets/jss/material-dashboard-pro-react/components/iconButtonStyle";

function IconCustomButton({ ...props }) {
  const { classes, color, children, customClass, noBg, ...rest } = props;
  const buttonClasses =
    classes.button +
    cx({
      [" " + classes[color]]: color,
      [" " + customClass]: customClass
    });
  return (
    <IconButton {...rest} className={buttonClasses}>
      {children}
    </IconButton>
  );
}

IconCustomButton.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose",
    "white",
    "simple",
    "defaultNoBackground",
    "primaryNoBackground",
    "infoNoBackground",
    "successNoBackground",
    "warningNoBackground",
    "dangerNoBackground",
    "roseNoBackground",
    "twitter",
    "twitterNoBackground",
    "facebook",
    "facebookNoBackground",
    "google",
    "googleNoBackground",
    "linkedin",
    "linkedinNoBackground",
    "pinterest",
    "pinterestNoBackground",
    "youtube",
    "youtubeNoBackground",
    "tumblr",
    "tumblrNoBackground",
    "github",
    "githubNoBackground",
    "behance",
    "behanceNoBackground",
    "dribbble",
    "dribbbleNoBackground",
    "reddit",
    "redditNoBackground"
  ]),
  customClass: PropTypes.string,
  disabled: PropTypes.bool
};

export default withStyles(iconButtonStyle)(IconCustomButton);
