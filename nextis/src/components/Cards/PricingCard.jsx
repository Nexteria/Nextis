import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Card from "material-ui/Card";
import CardContent from "material-ui/Card/CardContent";

import pricingCardStyle from "assets/jss/material-dashboard-pro-react/components/pricingCardStyle.jsx";

function PricingCard({ ...props }) {
  const {
    classes,
    title,
    price,
    description,
    plain,
    footer,
    iconColor,
    whitePrice
  } = props;
  const cardClasses =
    classes.card +
    " " +
    cx({
      [classes.cardPlain]: plain
    });
  const cardPrice =
    classes.cardPrice +
    " " +
    cx({
      [classes.white]: whitePrice === true && plain
    });
  const iconWrapper =
    classes.iconWrapper +
    " " +
    cx({
      [classes[iconColor]]: iconColor !== undefined,
      [classes.white]: plain && iconColor === undefined,
      [classes.grayColor]: plain === undefined && iconColor === undefined,
      [classes.iconOnPlain]: plain
    });
  return (
    <Card className={cardClasses}>
      <CardContent className={classes.cardContent}>
        <h6 className={classes.cardTitle}>{title}</h6>
        <div className={iconWrapper}>
          <props.icon className={classes.icon} />
        </div>
        <h3 className={cardPrice}>{price}</h3>
        <p className={classes.cardDescription}>{description}</p>
        {footer}
      </CardContent>
    </Card>
  );
}

PricingCard.defaultProps = {
  whitePrice: true
};

PricingCard.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  price: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.func,
  iconColor: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose",
    "gray",
    "white"
  ]),
  plain: PropTypes.bool,
  footer: PropTypes.node,
  whitePrice: PropTypes.bool
};

export default withStyles(pricingCardStyle)(PricingCard);
