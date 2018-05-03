import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Card from "material-ui/Card";
import CardContent from "material-ui/Card/CardContent";

// @material-ui/icons
import FormatQuote from "@material-ui/icons/FormatQuote";

import testimonialCardStyle from "assets/jss/material-dashboard-pro-react/components/testimonialCardStyle.jsx";

function TestimonialCard({ ...props }) {
  const {
    classes,
    cardDescription,
    cardTitle,
    cardSubtitle,
    imageAlt,
    image
  } = props;
  return (
    <Card className={classes.card}>
      <div className={classes.iconWrapper}>
        <FormatQuote className={classes.icon} />
      </div>
      <CardContent className={classes.cardContent}>
        <h5 className={classes.cardDescription}>{cardDescription}</h5>
      </CardContent>
      <div className={classes.footer}>
        <h4 className={classes.cardTitle}>{cardTitle}</h4>
        <h6 className={classes.cardCategory}>{cardSubtitle}</h6>
        <div className={classes.cardAvatar}>
          <img className={classes.img} alt={imageAlt} src={image} />
        </div>
      </div>
    </Card>
  );
}

TestimonialCard.defaultProps = {
  whitePrice: true
};

TestimonialCard.propTypes = {
  classes: PropTypes.object.isRequired,
  cardDescription: PropTypes.string,
  cardTitle: PropTypes.string,
  cardSubtitle: PropTypes.string,
  imageAlt: PropTypes.string,
  image: PropTypes.string
};

export default withStyles(testimonialCardStyle)(TestimonialCard);
