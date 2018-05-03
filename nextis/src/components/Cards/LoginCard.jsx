import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Card from "material-ui/Card";
import CardContent from "material-ui/Card/CardContent";
import CardActions from "material-ui/Card/CardActions";

import loginCardStyle from "assets/jss/material-dashboard-pro-react/components/loginCardStyle.jsx";
import Logo from "assets/img/nexteria_logo.png";

function LoginCard({ ...props }) {
  const {
    classes,
    plainCard,
    cardSubtitle,
    content,
    footer,
    footerAlign,
    customCardClass
  } = props;
  const plainCardClasses = cx({
    [" " + classes.cardPlain]: plainCard,
    [" " + customCardClass]: customCardClass !== undefined
  });
  return (
    <Card className={classes.card + plainCardClasses}>
      <div className={classes.logoContainer}>
        <img
          src={Logo}
          className={classes.logo}
          alt="Logo"
        />
      </div>
      <p className={classes.cardSubtitle}>{cardSubtitle}</p>
      <CardContent className={classes.cardContent}>{content}</CardContent>
      {footer !== undefined ? (
        <CardActions
          className={classes.cardActions + " " + classes[footerAlign]}
        >
          {footer}
        </CardActions>
      ) : null}
    </Card>
  );
}

LoginCard.defaultProps = {
  headerColor: "purple"
};

LoginCard.propTypes = {
  plainCard: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  headerColor: PropTypes.oneOf([
    "orange",
    "green",
    "red",
    "blue",
    "purple",
    "rose"
  ]),
  cardSubtitle: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  footerAlign: PropTypes.oneOf(["left", "right", "center"]),
  customCardClass: PropTypes.string
};

export default withStyles(loginCardStyle)(LoginCard);
