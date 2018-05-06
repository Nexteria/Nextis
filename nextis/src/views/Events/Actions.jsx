import React from "react";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from "common/store";
import { compose } from 'recompose';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Spinner from 'react-spinkit';

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Checkbox from "material-ui/Checkbox";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Info from "@material-ui/icons/Info";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
import IconButton from "components/CustomButtons/IconButton.jsx";

import eventActionsStyle from "assets/jss/material-dashboard-pro-react/views/eventActionsStyle.jsx";

class Actions extends React.Component {
  transformEvent(event, classes) {
    const terms = event.terms.sort((a, b) => {
      return a.eventStartDateTime.localeCompare(b.eventStartDateTime);
    });

    const startDateTimeString = format(parse(terms[0].eventStartDateTime), 'DD.MM.YYYY o HH:mm');
    const endDateTimeString = format(parse(terms[terms.length - 1].eventEndDateTime), 'DD.MM.YYYY o HH:mm');

    const attendee = event.attendees[0];
    const deadline = format(parse(attendee.signInCloseDateTime), 'DD.MM.YYYY o HH:mm');

    let fillButtons = [
      { color: "info", icon: Info },
      { color: "success", text: 'Prihlásiť' }
    ];

    if (!attendee.wontGo && !attendee.signedOut) {
      fillButtons.push(
        { color: "danger", text: 'Nezúčastním sa' }
      );
    }

    fillButtons = fillButtons.map((prop, key) => {
      return (
        <Button color={prop.color} customClass={classes.actionButton} key={key}>
          {prop.icon ? <prop.icon className={classes.icon} /> : null}
          {prop.text ? prop.text : null}
        </Button>
      );
    });

    return [
      event.name,
      <div>
        <div>{startDateTimeString}</div>
        <div>{endDateTimeString}</div>
      </div>,
      deadline,
      fillButtons
    ];
  }

  transformFeedbackTerm(term, classes) {
    const feedbackDeadline = format(parse(term.feedbackDeadlineAt), 'DD.MM.YYYY o HH:mm');
    const fillButtons = [
      { color: "info", text: 'Feedback' }
    ].map((prop, key) => {
      return (
        <Button
          color={prop.color}
          customClass={classes.actionButton}
          key={key}
          onClick={() => {
            const win = window.open(term.publicFeedbackLink, '_blank');
            win.focus();
          }}
        >
          {prop.icon ? <prop.icon className={classes.icon} /> : null}
          {prop.text ? prop.text : null}
        </Button>
      );
    });

    return [
      term.event.name,
      feedbackDeadline,
      fillButtons
    ];
  }

  render() {
    const { classes } = this.props;
    
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const openEventsForSignin = this.props.data.student.openEventsForSignin.filter(event =>
      !event.attendees[0].signedIn
    );
    const termsForFeedback = this.props.data.student.termsForFeedback;

    return (
      <div>
        <Table
          tableHead={[
            "Názov eventu",
            "Trvanie",
            "Deadline na prihlásenie",
            "Akcie"
          ]}
          tableData={
            [...openEventsForSignin].map(event =>
              this.transformEvent(event, classes)
            )
          }
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

        <Table
          tableHead={[
            "Názov eventu",
            "Deadline na vyplnenie",
            "Akcie"
          ]}
          tableData={
            [...termsForFeedback].sort((a, b) => {
              return a.feedbackDeadlineAt.localeCompare(b.feedbackDeadlineAt);
            }).map(term =>
              this.transformFeedbackTerm(term, classes)
            )
          }
          customCellClasses={[
            classes.center,
            classes.right,
            classes.right
          ]}
          customClassesForCells={[0, 4, 5]}
          customHeadCellClasses={[
            classes.center,
            classes.right,
            classes.right
          ]}
          customHeadClassesForCells={[0, 4, 5]}
        />
      </div>
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
      feedbackDeadlineAt
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
)(Actions);
