import React from "react";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import { withRouter } from "react-router-dom";
import Spinner from 'react-spinkit';

// material-ui icons
import Done from "@material-ui/icons/Done";
import Clear from "@material-ui/icons/Clear";

// core components
import Table from "components/Table/Table.jsx";


class EventsListTable extends React.Component {
  constructor(props) {
    super(props);

    this.handleNotesButtonClick = this.handleNotesButtonClick.bind(this);
  }

  handleNotesButtonClick(pointsId) {
    this.props.history.push(`/activity-points/${this.props.semesterId}/points/${pointsId}`);
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
              attendee.filledFeedback ? <Done className={classes.positive} /> : <Clear className={classes.negative} />
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
