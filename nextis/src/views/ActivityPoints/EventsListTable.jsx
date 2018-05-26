import React from "react";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinkit';
import isPast from 'date-fns/is_past';
import isAfter from 'date-fns/is_after';
import parse from 'date-fns/parse';


// material-ui icons
import Done from "@material-ui/icons/Done";
import Warning from "@material-ui/icons/Warning";
import Clear from "@material-ui/icons/Clear";

// core components
import Table from "components/Table/Table.jsx";
import Tooltip from 'material-ui/Tooltip';


class EventsListTable extends React.Component {
  constructor(props) {
    super(props);

    this.handleNotesButtonClick = this.handleNotesButtonClick.bind(this);
  }

  handleNotesButtonClick(pointsId) {
    this.props.history.push(`/activity-points/${this.props.semesterId}/points/${pointsId}`);
  }

  getFeedbackIcon(attendee, classes) {
    if (!attendee.filledFeedback) {
      return <Clear className={classes.negative} />;
    }

    const wasLate = attendee.terms.some(term => {
      const termAttendee = term.attendees[0];
      if (termAttendee.signedIn && termAttendee.wasPresent && termAttendee.feedbackDeadlineAt) {
        const feedbackDeadlineAt = parse(termAttendee.feedbackDeadlineAt);

        if (isPast(feedbackDeadlineAt)) {
          const filledFeedback = parse(termAttendee.filledFeedback);
          if (isAfter(filledFeedback, feedbackDeadlineAt)) {
            return true;
          }
        }
      }
      return false;
    });

    if (!wasLate) {
      return <Done className={classes.positive} />;
    } else {
      return (
        <Tooltip id="tooltip-icon" title="Feedback vyplnený po deadline">
          <Warning className={classes.warning} aria-label="Feedback vyplnený po deadline" />
        </Tooltip>
      );
    }
  }

  render() {
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const { classes, data } = this.props;

    const attendees = data.user.eventAttendees.filter(attendee => {
      if (!attendee.signedIn) {
        return false;
      }

      if (attendee.event.parentEvent) {
        return false;
      }

      return true;
    });

    return (
      <div>
        <Table
          hover
          tableHeaderColor="warning"
          tableHead={["Názov", "Body", "Prítomný", "Vyplnený feedback"]}
          customCellClasses={[
            classes.center,
            classes.center,
            classes.center,
          ]}
          customClassesForCells={[1, 2, 3]}
          tableData={attendees.map(attendee =>
            [
              attendee.event.name,
              attendee.event.activityPoints,
              attendee.wasPresent ? <Done className={classes.positive} /> : <Clear className={classes.negative} />,
              this.getFeedbackIcon(attendee, classes)
            ]
          )}
        />
      </div>
    );
  }
}

const userQuery = gql`
query FetchUser ($id: Int, $semesterId: Int){
  user (id: $id) {
    id
    eventAttendees (semesterId: $semesterId){
      id
      wasPresent
      signedIn
      filledFeedback
      event {
        id
        name
        activityPoints
        parentEvent {
          id
        }
      }
      terms {
        id
        attendees (userId: $id) {
          id
          signedIn
          filledFeedback
          feedbackDeadlineAt
          wasPresent
        }
      }
    }
  }
}
`;

export default compose(
  graphql(userQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.userId,
        semesterId: props.semesterId,
      },
    })
  }),
  withRouter,
)(EventsListTable);
