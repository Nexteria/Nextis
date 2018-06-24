import React from "react";
import { graphql } from 'react-apollo';
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import { connect } from "common/store";
import { compose } from 'recompose';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Spinner from 'react-spinkit';
import differenceInHours from 'date-fns/difference_in_hours';

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// material-ui icons
import Info from "@material-ui/icons/Info";

// core components
import Table from "components/Table/Table.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Tooltip from 'material-ui/Tooltip';
import SignInSection from 'views/Events/SignInSection.jsx';

import eventActionsStyle from "assets/jss/material-dashboard-pro-react/views/eventActionsStyle.jsx";

class Actions extends React.Component {

  transformFeedbackTerm(term, classes, history) {
    const startDateTimeString = format(parse(term.eventStartDateTime), 'DD.MM.YYYY o HH:mm');
    const endDateTimeString = format(parse(term.eventEndDateTime), 'DD.MM.YYYY o HH:mm');

    const feedbackDeadlineAt = parse(term.attendees[0].feedbackDeadlineAt);
    const feedbackDeadline = format(feedbackDeadlineAt, 'DD.MM.YYYY o HH:mm');
    const fillButtons = [
      { color: "info", icon: Info, action: () => history.push(`/events/${term.event.id}`) },
      { color: "info", text: 'Feedback', action: () => () => {
        const win = window.open(term.publicFeedbackLink, '_blank');
        win.focus();
      } }
    ].map((prop, key) => {
      return (
        <Button
          color={prop.color}
          customClass={classes.actionButton}
          key={key}
          onClick={prop.action}
        >
          {prop.icon ? <prop.icon className={classes.icon} /> : null}
          {prop.text ? prop.text : null}
        </Button>
      );
    });

    let termRowClassName = classes.positiveTermRow;
    let termDeadlineClassName = classes.positiveDeadline;

    const diffInHours = differenceInHours(feedbackDeadlineAt, new Date());
    if (diffInHours < 72 && diffInHours > 25) {
      termRowClassName = classes.warningTermRow;
      termDeadlineClassName = classes.warningDeadline;
    } else if (diffInHours <= 25) {
      termRowClassName = classes.emergencyTermRow;
      termDeadlineClassName = classes.emergencyDeadline;
    }


    return {
      className: termRowClassName,
      data: [
        term.event.name,
        <Tooltip
          placement="top"
          id="tooltip-icon"
          title="Vyplnenie feedbacku po deadline je penalizované strhnutím časti bodov!"
        >
          <div>
            <div>{startDateTimeString}</div>
            <div>{endDateTimeString}</div>
          </div>
        </Tooltip>,
        <span className={termDeadlineClassName}>{feedbackDeadline}</span>,
        fillButtons
      ]
    };
  }

  render() {
    const { classes, history } = this.props;
    
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const termsForFeedback = this.props.data.student.termsForFeedback;

    return (
      <div>
        <h3>Feedback</h3>
        <RegularCard
          content={
            termsForFeedback.length ?
              <Table
                tableHead={[
                  "Názov eventu",
                  "Trvanie",
                  'Deadline na vyplnenie',
                  "Akcie"
                ]}
                tableData={
                  [...termsForFeedback].sort((a, b) => {
                    return a.attendees[0].feedbackDeadlineAt.localeCompare(b.attendees[0].feedbackDeadlineAt);
                  }).map(term =>
                    this.transformFeedbackTerm(term, classes, history)
                  )
                }
                customCellClasses={[
                  classes.left,
                  classes.center,
                  classes.center,
                  classes.center,
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
              :
              <h4 className={classes.center}>Dobrá práca! Momentálne nemáš žiadny nevyplnený feedback!</h4>
          }
        />

        <h3>Prihlasovanie</h3>
        <SignInSection />
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
)(Actions);
