import React from 'react';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'common/store';
import Spinner from 'react-spinkit';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import isAfter from 'date-fns/is_after';
import { withRouter } from 'react-router-dom';


// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';

// @material-ui/icons

import Warning from '@material-ui/icons/Warning';
import DateRange from '@material-ui/icons/DateRange';
import LocalOffer from '@material-ui/icons/LocalOffer';
import Accessibility from '@material-ui/icons/Accessibility';
import CardTravel from '@material-ui/icons/CardTravel';
import Assignment from '@material-ui/icons/Assignment';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import StatsCard from 'components/Cards/StatsCard';
import Badge from 'components/Badge/Badge';

import dashboardStyle from 'assets/jss/material-dashboard-pro-react/views/dashboardStyle';


class Dashboard extends React.Component {
  render() {
    const { history, student, data } = this.props;
    const { user } = data;

    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    if (!data.user.student) {
      // for now only students have dashboard
      return null;
    }

    const activityPointsInfo = user.student.activityPointsInfo;

    let eventNextMeetingDate = '-';
    let terms = [...user.meetings];
    if (terms.length) {
      terms = terms.sort((a, b) => a.eventStartDateTime.localeCompare(b.eventStartDateTime));
      const soonestTerm = format(parse(terms[0].eventStartDateTime), 'DD.MM.YYYY o HH:mm');
      eventNextMeetingDate = `${soonestTerm}`;
    }

    const openEventsForSignin = user.eventsWithInvitation.filter((event) => {
      const attendee = event.attendees[0];
      const signinOpeningDate = parse(attendee.signInOpenDateTime);
      const signinClosingDate = parse(attendee.signInCloseDateTime);

      const now = new Date();

      return isAfter(now, signinOpeningDate) && isAfter(signinClosingDate, now);
    }).filter(event =>
      !event.attendees[0].signedIn && !event.attendees[0].signedOut && !event.attendees[0].wontGo
    ).length;

    const termsForFeedback = user.termsForFeedback.length;

    return (
      <div>
        <GridContainer>
          <ItemGrid xs={12} sm={6} md={6} lg={4}>
            <StatsCard
              icon={CardTravel}
              iconColor="orange"
              title="Tvoje najbližšie stretnutie"
              description={eventNextMeetingDate}
              statIcon={DateRange}
              descriptionColor={'gray'}
              smallColor={'gray'}
              statText={`Počet tvojich ďalších stretnutí: ${terms.length}`}
              iconHover
              iconLink="/events"
              badgeBottomLeft={<Badge color="success">{termsForFeedback}</Badge>}
              badgeTopRight={<Badge color="danger">{openEventsForSignin}</Badge>}
              history={history}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={6} lg={4}>
            <StatsCard
              icon={Accessibility}
              iconColor="orange"
              title="Aktivity body"
              description={`${activityPointsInfo.gained} / ${activityPointsInfo.base || '-'}`}
              statIcon={Warning}
              descriptionColor={'gray'}
              smallColor={'gray'}
              statText={`75% z Tvojho bodového základu: ${activityPointsInfo.minimum || '-'}`}
              iconHover
              iconLink={`/activity-points/${student.activeSemesterId}`}
              history={history}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={6} lg={4}>
            <StatsCard
              icon={Assignment}
              iconColor="orange"
              title="Stav účtu"
              description={user.balance / 100}
              descriptionColor={user.balance / 100 < 0 ? 'danger' : 'success'}
              smallColor={user.balance / 100 < 0 ? 'danger' : 'success'}
              small={'€'}
              statIcon={LocalOffer}
              statText={`Výška Tvojho mesačného členského je: ${user.student.tuitionFee / 100} €`}
              iconHover
              iconLink="/payments"
              history={history}
            />
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}


const userQuery = gql`
query FetchUser ($id: Int){
  user (id: $id){
    id
    balance
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
    meetings {
      id
      eventStartDateTime
    }
    student {
      id
      tuitionFee
      activityPointsInfo {
        gained
        minimum
        base
      }
    }
  }
}
`;

export default compose(
  connect(state => ({ user: state.user, student: state.student })),
  withStyles(dashboardStyle),
  graphql(userQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.user.id,
      },
    })
  }),
  withRouter,
)(Dashboard);
