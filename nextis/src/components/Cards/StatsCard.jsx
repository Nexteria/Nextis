import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Card from "material-ui/Card";
import CardContent from "material-ui/Card/CardContent";
import CardHeader from "material-ui/Card/CardHeader";
import CardActions from "material-ui/Card/CardActions";
import Typography from "material-ui/Typography";

import statsCardStyle from "assets/jss/material-dashboard-pro-react/components/statsCardStyle";

class StatsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  render() {
    const {
      classes,
      title,
      description,
      descriptionColor,
      statLink,
      small,
      smallColor,
      statText,
      statIconColor,
      iconColor,
      iconHover,
      iconLink,
      history,
      badgeBottomLeft,
      badgeBottomRight,
      badgeTopLeft,
      badgeTopRight,
    } = this.props;

    let addHoverEvent = {};
    if (iconHover) {
      if (navigator.userAgent.match(/iPad/i) != null) {
        addHoverEvent.onClick = () =>
          this.setState({ hover: !this.state.hover });
      } else {
        addHoverEvent.onMouseEnter = () => this.setState({ hover: true });
        addHoverEvent.onMouseLeave = () => this.setState({ hover: false });
      }
    }

    const cardHeaderClasses =
      classes.cardHeader +
      " " +
      classes[iconColor + "CardHeader"] +
      " " +
      cx({
        [" " + classes.moveHeaderUp]: this.state.hover,
        [" " + classes.cardHeaderButton]: iconLink,
      });
    
    return (
      <Card className={classes.card}>
        <CardHeader
          {...addHoverEvent}
          classes={{
            root: cardHeaderClasses,
            avatar: classes.cardAvatar
          }}
          avatar={
            <div>
              <this.props.icon className={classes.cardIcon} />
              {badgeBottomLeft !== null ?
                <div className={classes.badgeBottomLeft}>{badgeBottomLeft}</div> : null
              }
              {badgeBottomRight !== null ?
                <div className={classes.badgeBottomRight}>{badgeBottomRight}</div> : null
              }
              {badgeTopLeft !== null ?
                <div className={classes.badgeTopLeft}>{badgeTopLeft}</div> : null
              }
              {badgeTopRight !== null ?
                <div className={classes.badgeTopRight}>{badgeTopRight}</div> : null
              }
            </div>
          }
          onClick={() => iconLink ? history.push(iconLink) : null}
        />
        <CardContent className={classes.cardContent}>
          <Typography component="p" className={classes.cardCategory}>
            {title}
          </Typography>
          <Typography
            variant="headline"
            component="h2"
            className={classes[descriptionColor + "CardTitle"]}
          >
            {description}{" "}
            {small !== undefined ? (
              <small className={classes[smallColor + "CardTitleSmall"]}>{small}</small>
            ) : null}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <div className={classes.cardStats}>
            <this.props.statIcon
              className={
                classes.cardStatsIcon +
                " " +
                classes[statIconColor + "CardStatsIcon"]
              }
            />{" "}
            {statLink !== undefined ? (
              <a href={statLink.href} className={classes.cardStatsLink}>
                {statLink.text}
              </a>
            ) : statText !== undefined ? (
              statText
            ) : null}
          </div>
        </CardActions>
      </Card>
    );
  }
}

StatsCard.defaultProps = {
  iconColor: "purple",
  statIconColor: "gray",
  iconHover: false,
  iconLink: null,
  notificationsBottomLeft: null,
  notificationsBottomRight: null,
  notificationsTopLeft: null,
  notificationsTopRight: null,
};

StatsCard.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.func.isRequired,
  iconColor: PropTypes.oneOf(["orange", "green", "red", "blue", "purple"]),
  iconLink: PropTypes.string,
  iconHover: PropTypes.bool,
  title: PropTypes.node,
  badgeBottomLeft: PropTypes.node,
  badgeBottomRight: PropTypes.node,
  badgeTopLeft: PropTypes.node,
  badgeTopRight: PropTypes.node,
  description: PropTypes.node,
  descriptionColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  small: PropTypes.node,
  smallColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  statIcon: PropTypes.func.isRequired,
  statIconColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  statLink: PropTypes.object,
  statText: PropTypes.node
};

export default withStyles(statsCardStyle)(StatsCard);
