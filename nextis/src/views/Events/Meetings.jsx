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

import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";

class Meetings extends React.Component {
  transformTerm(term, classes) {

    const startDateTimeString = format(parse(term.eventStartDateTime), 'DD.MM.YYYY o HH:mm');
    const fillButtons = [
      { color: "info", icon: Info },
      { color: "danger", text: 'Odhlásiť'  }
    ].map((prop, key) => {
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
    );
  }
}

const meetingsQuery = gql`
query FetchMeetings ($id: Int){
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
      },
    })
  }),
)(Meetings);
