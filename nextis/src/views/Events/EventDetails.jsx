import React from "react";

import withStyles from "material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from 'react-spinkit';

import Accessibility from "@material-ui/icons/Accessibility";

import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import Button from "components/CustomButtons/Button.jsx";

import eventDetailsStyle from "assets/jss/material-dashboard-pro-react/views/eventDetailsStyle.jsx";

export class EventDetails extends React.Component {
  state = {
    detailsOpen: false,
  }

  isDescriptionEmpty(description) {
    if (description.trim() === '' || description.trim() === '<p><br></p>') {
      return true;
    }

    return false;
  }

  render() {
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const { event } = this.props.data;
    const { classes } = this.props;

    return (
      <div>
        <h2 className={classes.eventName}>{event.name}</h2>
        <div className={classes.activityPointsContainer}>
          <Accessibility /> Aktivity body: {event.activityPoints}
        </div>

        <GridContainer justify="center">
          <ItemGrid xs={12} sm={12} md={12} lg={12}>
            <label className={classes.label}>Terminy</label>
          </ItemGrid>
        </GridContainer>

        <GridContainer justify="center">
        </GridContainer>

        <GridContainer justify="flex-start">
          <ItemGrid xs={12} sm={12} md={12} lg={12}>
            <div>
              <label className={classes.label}>Krátky popis</label>
            </div>
            <div dangerouslySetInnerHTML={{__html: event.shortDescription}} />
          </ItemGrid>

          <ItemGrid xs={12} sm={12} md={12} lg={12}>
            <div>
              <label className={classes.label}>Detailný popis</label>
            </div>
            {this.state.detailsOpen ?
              <div dangerouslySetInnerHTML={{__html: event.description}} />
              : null
            }

            {this.isDescriptionEmpty(event.description) ?
              <div className={classes.placeholderText}>Ďalšie podrobnosti nie sú uvedené</div>
              :
              <Button onClick={() => this.setState({ detailsOpen: !this.state.detailsOpen })}>
                {this.state.detailsOpen ? 'Skryť detailný popis' : 'Zobraziť detailný popis'}
              </Button>
            }
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}

const eventQuery = gql`
query FetchEvent ($id: Int){
  event (id: $id){
    id
    name
    activityPoints
    description
    shortDescription
  }
}
`;

export default compose(
  withStyles(eventDetailsStyle),
  graphql(eventQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.eventId,
      },
    })
  }),
  withRouter,
)(EventDetails);
