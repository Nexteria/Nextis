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

// core components
import Button from "components/CustomButtons/Button";

import imagePriceCardStyle from "assets/jss/material-dashboard-pro-react/components/imagePriceCardStyle.jsx";

class ImagePriceCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }
  render() {
    const {
      classes,
      image,
      title,
      text,
      price,
      statIconColor,
      statLink,
      statText,
      underImage,
      hover
    } = this.props;
    const cardHeaderClasses =
      classes.cardHeader +
      cx({
        [" " + classes.moveImageUp]: this.state.hover && hover
      });
    var addHoverEvent = {};
    if (hover) {
      if (navigator.userAgent.match(/iPad/i) != null) {
        addHoverEvent.onClick = () =>
          this.setState({ hover: !this.state.hover });
      } else {
        addHoverEvent.onMouseEnter = () => this.setState({ hover: true });
        addHoverEvent.onMouseLeave = () => this.setState({ hover: false });
      }
    }
    return (
      <Card className={classes.card} {...addHoverEvent}>
        <CardHeader
          className={cardHeaderClasses}
          subheader={
            <Button color="defaultNoBackground" customClass={classes.link}>
              <img src={image} alt="..." className={classes.cardImage} />
            </Button>
          }
        />
        <CardContent className={classes.cardContent}>
          {hover ? (
            <div className={classes.underImage}>{underImage}</div>
          ) : null}
          <Typography
            variant="title"
            component="h4"
            className={classes.cardTitle}
          >
            {title}
          </Typography>
          <Typography component="p" className={classes.cardCategory}>
            {text}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <div className={classes.cardPrice}>
            <h4 className={classes.cardPriceText}>{price}</h4>
          </div>
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

ImagePriceCard.defaultProps = {
  hover: false,
};

ImagePriceCard.propTypes = {
  classes: PropTypes.object.isRequired,
  image: PropTypes.string,
  title: PropTypes.node,
  text: PropTypes.node,
  price: PropTypes.string,
  location: PropTypes.string,
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
  statText: PropTypes.node,
  // if the chart should move up on hover
  hover: PropTypes.bool,
  // what to be displayed under tha chart on hover
  underImage: PropTypes.node
};

export default withStyles(imagePriceCardStyle)(ImagePriceCard);
