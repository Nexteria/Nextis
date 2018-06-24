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

// material-ui icons
import Info from "@material-ui/icons/Info";

// core components
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";

import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";

class Meetings extends React.Component {
  transformTerm(term, classes) {

    const startDateTimeString = format(parse(term.eventStartDateTime), 'DD.MM.YYYY o HH:mm');
    let fillButtons = [
      { color: "info", icon: Info },
    ];

    if (term.attendees[0].signedIn && term.attendees[0].signedIn !== "") {
      fillButtons.push({ color: "danger", text: 'Odhlásiť' });
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
      term.event.name,
      startDateTimeString,
      `${term.location.name}, ${term.location.addressLine1}${term.location.addressLine2 ? ', ' + term.location.addressLine2 : ''}`,
      fillButtons
    ];
  }
  render() {
    const { classes } = this.props;
    
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const meetings = this.props.data.student.meetings;

    return (
      <Table
        tableHead={[
          "Názov eventu",
          "Dátum konania",
          "Miesto",
          "Akcie"
        ]}
        tableData={
          [...meetings].sort((a, b) => {
            return a.eventStartDateTime.localeCompare(b.eventStartDateTime);
          }).map(term =>
            this.transformTerm(term, classes)
          )
        }
        customCellClasses={[
          classes.left,
          classes.center,
          classes.center
        ]}
        customClassesForCells={[0, 1, 2]}
        customHeadCellClasses={[
          classes.left,
          classes.center,
          classes.center
        ]}
        customHeadClassesForCells={[0, 1, 2]}
      />
    );
  }
}

const meetingsQuery = gql`
query FetchMeetings ($id: Int, $userId: Int){
  student (id: $id){
    id
    userId
    meetings {
      id
      eventStartDateTime
      eventEndDateTime
      event {
        id
        name
      }
      location {
        id
        name
        addressLine1
        addressLine2
      }
      attendees (userId: $userId){
        id
        signedIn
      }
    }
  }
}
`;

export default compose(
  connect(state => ({ user: state.user })),
  withStyles(extendedTablesStyle),
  graphql(meetingsQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.user.studentId,
        userId: props.user.id,
      },
    })
  }),
)(Meetings);
