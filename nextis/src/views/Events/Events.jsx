import React from 'react';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'common/store';
import Spinner from 'react-spinkit';
import { Route, withRouter } from 'react-router-dom';
import parse from 'date-fns/parse';
import isAfter from 'date-fns/is_after';

// @material-ui/icons
import ListIcon from '@material-ui/icons/List';
import FeedbackIcon from '@material-ui/icons/Feedback';
import TodayIcon from '@material-ui/icons/Today';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import NavPills from 'components/NavPills/NavPills';

import Meetings from 'views/Events/Meetings';
import Actions from 'views/Events/Actions';
import Overview from 'views/Events/Overview';
import Badge from 'components/Badge/Badge';

import EventDetailsDialog from 'views/Events/EventDetailsDialog';
import SignInDialog from 'views/Events/Signin/SignInDialog';
import SignOutDialog from 'views/Events/Signin/SignOutDialog';
import SignInFormDialog from 'views/Events/Signin/SignInFormDialog';

const styles = {
  pageSubcategoriesTitle: {
    color: '#3C4858',
    textDecoration: 'none',
    textAlign: 'center'
  }
};

class Events extends React.Component {
  render() {
    const { data } = this.props;

    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const { user } = data;

    // TODO: move filtering to the server as param isOpen
    const openEventsForSignin = !user.student ? 0 : user.student.eventsWithInvitation.filter((event) => {
      const attendee = event.attendees[0];
      const signinOpeningDate = parse(attendee.signInOpenDateTime);
      const signinClosingDate = parse(attendee.signInCloseDateTime);

      const now = new Date();

      return isAfter(now, signinOpeningDate) && isAfter(signinClosingDate, now);
    }).filter((event) => {
      const attendee = event.attendees[0];

      return !attendee.signedIn && !attendee.signedOut && !attendee.wontGo;
    }).length;

    const termsForFeedback = user.student ? user.student.termsForFeedback.length : 0;

    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={12} md={12} lg={12}>
          <NavPills
            color="warning"
            alignCenter
            tabs={[
              {
                tabButtonTitle: 'Prihlasovanie,',
                tabButtonSubtitle: 'feedback',
                tabIcon: FeedbackIcon,
                badgeBottomLeft: (
                  <Badge color="success">
                    {termsForFeedback}
                  </Badge>
                ),
                badgeTopRight: (
                  <Badge color="danger">
                    {openEventsForSignin}
                  </Badge>
                ),
                tabContent: (
                  <Actions />
                )
              },
              {
                tabButtonTitle: 'Tvoje',
                tabButtonSubtitle: 'stretnutia',
                tabIcon: TodayIcon,
                tabContent: (
                  user.student ? <Meetings /> : null
                )
              },
              {
                tabButtonTitle: 'Prehľad',
                tabButtonSubtitle: 'udalostí',
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

        <Route
          path="/events/:eventId/signIn"
          exact
          component={SignInDialog}
        />

        <Route
          path="/events/:eventId/signInForm"
          exact
          component={SignInFormDialog}
        />

        <Route
          path="/events/:eventId/terms/:termId/signOut"
          exact
          component={SignOutDialog}
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
      eventsWithInvitation {
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
    options: (props) => {
      const { user } = props;

      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          id: user.id,
        },
      };
    }
  }),
)(Events);
