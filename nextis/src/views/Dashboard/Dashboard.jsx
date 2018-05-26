import React from "react";
import PropTypes from "prop-types";
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from "common/store";
import Spinner from 'react-spinkit';
import parse from 'date-fns/parse';
import format from 'date-fns/format';


// material-ui components
import withStyles from "material-ui/styles/withStyles";

// @material-ui/icons

import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Accessibility from "@material-ui/icons/Accessibility";
import CardTravel from "@material-ui/icons/CardTravel";
import Assignment from "@material-ui/icons/Assignment";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import StatsCard from "components/Cards/StatsCard.jsx";
import Badge from "components/Badge/Badge.jsx";

import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";


class Dashboard extends React.Component {
  render() {
    const { history, student } = this.props;
    const { user } = this.props.data;

    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const activityPointsInfo = user.student.activityPointsInfo;

    let eventNextMeetingDate = '-'
    let terms = [...user.student.meetings];
    if (terms.length) {
      terms = terms.sort((a, b) => a.eventStartDateTime.localeCompare(b.eventStartDateTime));
      const soonestTerm = format(parse(terms[0].eventStartDateTime), 'DD.MM.YYYY o HH:mm');
      eventNextMeetingDate = `${soonestTerm}`;
    }

    const openEventsForSignin = user.student.openEventsForSignin.filter(event =>
      !event.attendees[0].signedIn && !event.attendees[0].signedOut && !event.attendees[0].wontGo
    ).length;
    const termsForFeedback = user.student.termsForFeedback.length;

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
              statText={`Po4et tvojich ďalších stretnutí: ${terms.length}`}
              iconHover
              iconLink="/events"
              badgeBottomLeft={termsForFeedback ? <Badge color="success">{termsForFeedback}</Badge> : null}
              badgeTopRight={openEventsForSignin ? <Badge color="danger">{openEventsForSignin}</Badge> : null}
              history={history}
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={6} lg={4}>
            <StatsCard
              icon={Accessibility}
              iconColor="orange"
              title="Aktivity body"
              description={`${activityPointsInfo.gained} / ${activityPointsInfo.base}`}
              statIcon={Warning}
              descriptionColor={'gray'}
              smallColor={'gray'}
              statText={`75% z Tvojho bodového základu: ${activityPointsInfo.minimum}`}
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

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};


const userQuery = gql`
query FetchUser ($id: Int){
  user (id: $id){
    id
    balance
    student {
      id
      tuitionFee
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
      meetings {
        id
        eventStartDateTime
      }
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
)(Dashboard);
