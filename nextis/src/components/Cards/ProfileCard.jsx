import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Card from "material-ui/Card";
import CardContent from "material-ui/Card/CardContent";
import CardHeader from "material-ui/Card/CardHeader";
import Typography from "material-ui/Typography";

import profileCardStyle from "assets/jss/material-dashboard-pro-react/components/profileCardStyle";

function ProfileCard({ ...props }) {
  const {
    classes,
    subtitle,
    title,
    description,
    avatar,
    content,
    footer,
    customCardClass,
    customCardAvatarClass,
    customCardFooterClass
  } = props;
  const cardClasses =
    classes.card +
    " " +
    cx({
      [customCardClass]: customCardClass !== undefined
    });
  const cardAvatarClass =
    classes.cardAvatar +
    " " +
    cx({
      [customCardAvatarClass]: customCardAvatarClass !== undefined
    });
  const cardFooterClass =
    classes.cardFooter +
    " " +
    cx({
      [customCardFooterClass]: customCardFooterClass !== undefined
    });
  return (
    <Card className={cardClasses}>
      <CardHeader
        classes={{
          root: classes.cardHeader,
          avatar: cardAvatarClass
        }}
        avatar={<img src={avatar} alt="..." className={classes.img} />}
      />
      <CardContent className={classes.textAlign + " " + classes.cardContent}>
        {subtitle !== undefined ? (
          <Typography component="h6" className={classes.cardSubtitle}>
            {subtitle}
          </Typography>
        ) : null}
        {title !== undefined ? (
          <Typography component="h4" className={classes.cardTitle}>
            {title}
          </Typography>
        ) : null}
        {description !== undefined ? (
          <Typography component="p" className={classes.cardDescription}>
            {description}
          </Typography>
        ) : null}
        {content !== undefined ? content : null}
      </CardContent>
      {footer !== undefined ? (
        <div className={cardFooterClass}>{footer}</div>
      ) : null}
    </Card>
  );
}

ProfileCard.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  description: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  avatar: PropTypes.string,
  customCardClass: PropTypes.string,
  customCardAvatarClass: PropTypes.string
};

export default withStyles(profileCardStyle)(ProfileCard);
