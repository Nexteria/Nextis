import React from "react";

import withStyles from "material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from 'react-spinkit';

import Accessibility from "@material-ui/icons/Accessibility";
import Place from "@material-ui/icons/Place";
import People from "@material-ui/icons/People";

import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Badge from "components/Badge/Badge.jsx";

import avatarImg from "assets/img/default-avatar.png";

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

  formatLocation(location) {
    return (
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
        target="_blank"
      >
        {location.name}
      </a>
    )
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
        <GridContainer justify="center">
          <ItemGrid xs={12} sm={12} md={12} lg={12}>
            <Accessibility /> Aktivity body: {event.activityPoints}
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={12} lg={12}>
            <Place />
            <span> Miesto konania: </span>
            <span>
              {event.terms.length > 1 ?
                'Závisí od konkrétneho termínu'
                :
                this.formatLocation(event.terms[0].location)
              }
            </span>
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={12} lg={12}>
            <People />
            <span>Prihlásený: {event.attendees.filter(attendee => attendee.signedIn).length}</span>
            <span>, Pozvaný: {event.attendees.length}</span>
            <span>, Náhradníci: {event.attendees.filter(attendee => attendee.standIn).length}</span>
          </ItemGrid>
        </GridContainer>

        <GridContainer justify="center">
          <ItemGrid xs={12} sm={12} md={12} lg={12}>
            <div className={classes.sectionTitle}>
              <Badge color="gray">Terminy</Badge>
            </div>
          </ItemGrid>
        </GridContainer>

        <GridContainer justify="center">
        </GridContainer>

        <GridContainer justify="flex-start">
          <ItemGrid xs={12} sm={12} md={12} lg={12} className={classes.section}>
            <div className={classes.sectionTitle}>
              <Badge color="gray">Krátky popis</Badge>
            </div>
            <div dangerouslySetInnerHTML={{__html: event.shortDescription}} />
          </ItemGrid>

          <ItemGrid xs={12} sm={12} md={12} lg={12} className={classes.section}>
            <div className={classes.sectionTitle}>
              <Badge color="gray">Detailný popis</Badge>
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

          <ItemGrid xs={12} sm={12} md={12} lg={12} className={classes.section}>
            <div className={classes.sectionTitle}>
              <Badge color="gray">Lektori</Badge>
            </div>
            {event.lectors.length ?
              <GridContainer justify="center">
                {event.lectors.map(lector =>
                  <ItemGrid xs={12} sm={12} md={12} lg={12} className={classes.lectorContainer} key={lector.id}>
                    <div className={classes.avatarContainer}>
                      <img
                        src={lector.profilePicture ?
                          lector.profilePicture.filePath
                          :
                          avatarImg
                        }
                        alt={`${lector.firstName} ${lector.lastName}`}
                        className={classes.img}
                      />
                    </div>
                    <label>{`${lector.firstName} ${lector.lastName}`}</label>
                  </ItemGrid>
                )}
              </GridContainer>
              :
              <div className={classes.placeholderText}>K danému eventu neboli uvedený žiadny lektori</div>
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
    lectors {
      id
      firstName
      lastName
      profilePicture {
        id
        filePath
      }
    }
    attendees {
      id
      standIn
      signedIn
      signedOut
      wontGo
    }
    terms {
      id
      location {
        id
        latitude
        longitude
        name
      }
    }
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
