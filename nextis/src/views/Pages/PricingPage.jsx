import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// @material-ui/icons
import Weekend from "@material-ui/icons/Weekend";
import Home from "@material-ui/icons/Home";
import Business from "@material-ui/icons/Business";
import AccountBalance from "@material-ui/icons/AccountBalance";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import PricingCard from "components/Cards/PricingCard.jsx";
import Button from "components/CustomButtons/Button.jsx";

import pricingPageStyle from "assets/jss/material-dashboard-pro-react/views/pricingPageStyle.jsx";

class PricingPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.content}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <ItemGrid xs={12} sm={12} md={6}>
              <h2 className={classes.title}>Pick the best plan for you</h2>
              <h5 className={classes.description}>
                You have Free Unlimited Updates and Premium Support on each
                package.
              </h5>
            </ItemGrid>
          </GridContainer>
          <GridContainer justify="center">
            <ItemGrid xs={12} sm={12} md={3}>
              <PricingCard
                plain
                title="FREELANCER"
                price="FREE"
                description="This is good if your company size is between 2 and 10 Persons."
                icon={Weekend}
                footer={
                  <Button round color="white">
                    Choose plan
                  </Button>
                }
              />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={3}>
              <PricingCard
                title="SMALL COMPANY"
                price="$29"
                description="This is good if your company size is between 2 and 10 Persons."
                icon={Home}
                iconColor="rose"
                footer={
                  <Button round color="rose">
                    Choose plan
                  </Button>
                }
              />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={3}>
              <PricingCard
                plain
                title="MEDIUM COMPANY"
                price="$69"
                description="This is good if your company size is between 11 and 99 Persons."
                icon={Business}
                footer={
                  <Button round color="white">
                    Choose plan
                  </Button>
                }
              />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={3}>
              <PricingCard
                plain
                title="ENTERPRISE"
                price="$159"
                description="This is good if your company size is 99+ persons."
                icon={AccountBalance}
                footer={
                  <Button round color="white">
                    Choose plan
                  </Button>
                }
              />
            </ItemGrid>
          </GridContainer>
        </div>
      </div>
    );
  }
}

PricingPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(pricingPageStyle)(PricingPage);
