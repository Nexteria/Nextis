import React from "react";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from "react-router-dom";
import { connect } from "common/store";
import { compose } from 'recompose';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import isAfter from 'date-fns/is_after';
import Spinner from 'react-spinkit';

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// material-ui icons
import Info from "@material-ui/icons/Info";

// core components
import RegularCard from "components/Cards/RegularCard.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Table from "components/Table/Table.jsx";

import eventActionsStyle from "assets/jss/material-dashboard-pro-react/views/eventActionsStyle.jsx";

class SignInSection extends React.Component {

  transformEvent(event, classes, history) {
    const terms = event.terms.sort((a, b) => {
      return a.eventStartDateTime.localeCompare(b.eventStartDateTime);
    });

    const startDateTimeString = format(parse(terms[0].eventStartDateTime), 'DD.MM.YYYY o HH:mm');
    const endDateTimeString = format(parse(terms[terms.length - 1].eventEndDateTime), 'DD.MM.YYYY o HH:mm');

    const attendee = event.attendees[0];
    const deadline = format(parse(attendee.signInCloseDateTime), 'DD.MM.YYYY o HH:mm');

    let fillButtons = [
      { color: "info", icon: Info, action: () => history.push(`/events/${event.id}`) },
      { color: "success", text: 'Prihlásiť' }
    ];

    if (!attendee.wontGo && !attendee.signedOut) {
      fillButtons.push(
        { color: "danger", text: 'Nezúčastním sa' }
      );
    }

    fillButtons = fillButtons.map((prop, key) => {
      return (
        <Button color={prop.color} customClass={classes.actionButton} key={key} onClick={prop.action}>
          {prop.icon ? <prop.icon className={classes.icon} /> : null}
          {prop.text ? prop.text : null}
        </Button>
      );
    });

    return {
      data: [
        event.name,
        <div>
          <div>{startDateTimeString}</div>
          <div>{endDateTimeString}</div>
        </div>,
        deadline,
        fillButtons
      ],
      shaded: attendee.signedOut || attendee.wontGo,
    };
  }

  render() {
    const { classes, history } = this.props;
    
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const openEventsForSignin = this.props.data.student.openEventsForSignin.filter(event =>
      !event.attendees[0].signedIn
    );

    let events = openEventsForSignin.map(event => this.transformEvent(event, classes, history));
    events.sort((a, b) => isAfter(a.startDateTime, b.startDateTime) ? -1 : 1);

    return (
      <RegularCard
        customCardClasses={classes.noTopMarginCard}
        content={
          <Table
            tableHead={[
              "Názov eventu",
              "Trvanie",
              "Deadline na prihlásenie",
              "Akcie"
            ]}
            tableData={[...events]}
            customCellClasses={[
              classes.left,
              classes.center,
              classes.center,
              classes.left,
            ]}
            customClassesForCells={[0, 1, 2, 3]}
            customHeadCellClasses={[
              classes.left,
              classes.center + " " + classes.durationField,
              classes.center,
              classes.center + " " + classes.actionButtons,
            ]}
            customHeadClassesForCells={[0, 1, 2, 3]}
          />
        }
      />
    );
  }
}

const meetingsQuery = gql`
query FetchMeetings ($id: Int, $userId: Int){
  student (id: $id){
    id
    userId
    termsForFeedback {
      id
      attendees (userId: $userId) {
        id
        feedbackDeadlineAt
      }
      eventStartDateTime
      eventEndDateTime
      publicFeedbackLink
      event {
        id
        name
      }
    }
    openEventsForSignin {
      id
      name
      eventType
      status
      shortDescription
      groupedEvents {
        id
      }
      parentEvent {
        id
      }
      terms {
        id
        eventStartDateTime
        eventEndDateTime
        parentTermId
      }
      attendees (userId: $userId){
        id
        signedIn
        signedOut
        wontGo
        signInOpenDateTime
        signInCloseDateTime
      }
    }
  }
}
`;

export default compose(
  connect(state => ({ user: state.user })),
  withStyles(eventActionsStyle),
  graphql(meetingsQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.user.studentId,
        userId: props.user.id,
      },
    })
  }),
  withRouter,
)(SignInSection);
