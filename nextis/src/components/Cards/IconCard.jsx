import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Card from "material-ui/Card";
import CardContent from "material-ui/Card/CardContent";
import CardHeader from "material-ui/Card/CardHeader";

import iconCardStyle from "assets/jss/material-dashboard-pro-react/components/iconCardStyle.jsx";

function IconCard({ ...props }) {
  const {
    classes,
    title,
    content,
    iconColor,
    category,
    footer,
    plain,
    customCardContentClass
  } = props;
  const cardClasses =
    classes.card +
    " " +
    cx({
      [classes.cardPlain]: plain
    });
  const cardContentClasses =
    classes.cardContent +
    " " +
    cx({
      [customCardContentClass]: customCardContentClass !== undefined
    });
  return (
    <Card className={cardClasses}>
      <CardHeader
        classes={{
          root: classes.cardHeader + " " + classes[iconColor + "CardHeader"],
          avatar: classes.cardAvatar
        }}
        avatar={<props.icon className={classes.cardIcon} />}
      />
      <CardContent className={cardContentClasses}>
        <h4 className={classes.cardTitle}>
          {title}
          {category !== undefined ? (
            <small className={classes.cardCategory}>{category}</small>
          ) : null}
        </h4>
        {content}
      </CardContent>
      {footer !== undefined ? (
        <div className={classes.cardFooter}>{footer}</div>
      ) : null}
    </Card>
  );
}

IconCard.defaultProps = {
  iconColor: "purple",
};

IconCard.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.func.isRequired,
  iconColor: PropTypes.oneOf([
    "orange",
    "green",
    "red",
    "blue",
    "purple",
    "rose"
  ]),
  title: PropTypes.node,
  category: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  plain: PropTypes.bool,
  customCardContentClass: PropTypes.string
};

export default withStyles(iconCardStyle)(IconCard);
