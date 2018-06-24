import React from "react";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from "common/store";
import Spinner from 'react-spinkit';
import { Route, withRouter } from "react-router-dom";

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
import Badge from "components/Badge/Badge.jsx";

import EventDetailsDialog from "views/Events/EventDetailsDialog.jsx";

const styles = {
  pageSubcategoriesTitle: {
    color: "#3C4858",
    textDecoration: "none",
    textAlign: "center"
  }
};

class Events extends React.Component {
  render() {
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const { user } = this.props.data;

    const openEventsForSignin = user.student.openEventsForSignin.filter(event =>
      !event.attendees[0].signedIn && !event.attendees[0].signedOut && !event.attendees[0].wontGo
    ).length;

    const termsForFeedback = user.student.termsForFeedback.length;

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
              badgeBottomLeft: <Badge color="success">{termsForFeedback}</Badge>,
              badgeTopRight: <Badge color="danger">{openEventsForSignin}</Badge>,
              tabContent: (
                <Actions />
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
        <Route
          path="/events/:eventId"
          exact
          component={EventDetailsDialog}
        />
      </GridContainer>
    );
  }
}

const userQuery = gql`
query FetchUser ($id: Int){
  user (id: $id){
    id
    student {
      id
      termsForFeedback {
        id
      }
      openEventsForSignin {
        id
        name
        attendees (userId: $id) {
          id
          signedIn
          signedOut
          wontGo
        }
      }
    }
  }
}
`;

export default compose(
  withRouter,
  connect(state => ({ user: state.user, student: state.student })),
  withStyles(styles),
  graphql(userQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.user.id,
      },
    })
  }),
)(Events);
