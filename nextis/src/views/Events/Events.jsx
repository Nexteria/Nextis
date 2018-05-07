import React from "react";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// @material-ui/icons
import ListIcon from "@material-ui/icons/List";
import FeedbackIcon from "@material-ui/icons/Feedback";
import TodayIcon from "@material-ui/icons/Today";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import NavPills from "components/NavPills/NavPills.jsx";

import Meetings from "views/Events/Meetings.jsx";
import Actions from "views/Events/Actions.jsx";
import Overview from "views/Events/Overview.jsx";

const styles = {
  pageSubcategoriesTitle: {
    color: "#3C4858",
    textDecoration: "none",
    textAlign: "center"
  }
};

class Events extends React.Component {
  render() {
    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={12} md={12} lg={12}>
          <NavPills
            color="warning"
            alignCenter
            tabs={[
            {
              tabButtonTitle: "Prihlasovanie,",
              tabButtonSubtitle: "feedback",
              tabIcon: FeedbackIcon,
              tabContent: (
              <RegularCard
                cardTitle="Description about product"
                cardSubtitle="More information here"
                content={<Actions />}
              />
              )
            },
            {
              tabButtonTitle: "Tvoje",
              tabButtonSubtitle: "stretnutia",
              tabIcon: TodayIcon,
              tabContent: (
              <RegularCard
                titleAlign="center"
                cardTitle="Tvoje stretnutia na ktoré si sa záväzne prihlásil"
                content={<Meetings />}
              />
              )
            },
            {
              tabButtonTitle: "Prehľad",
              tabButtonSubtitle: "udalostí",
              tabIcon: ListIcon,
              tabContent: (
                <Overview />
              )
            },
            ]}
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(Events);
