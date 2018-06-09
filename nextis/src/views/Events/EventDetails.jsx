import React from "react";

import withStyles from "material-ui/styles/withStyles";
import { withRouter } from "react-router-dom";
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from 'react-spinkit';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

import Accessibility from "@material-ui/icons/Accessibility";
import Place from "@material-ui/icons/Place";
import People from "@material-ui/icons/People";
import EventIcon from '@material-ui/icons/Event';

import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Badge from "components/Badge/Badge.jsx";
import Table from "components/Table/Table.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";

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

    const parentTerms = {};
    let rootTerms = 0;
    [...event.terms].forEach(term => {
      if (term.parentTermId) {
        parentTerms[term.parentTermId] = true;
      } else {
        rootTerms += 1;
      }
    });

    const hasAlternatives = rootTerms > 1;

    return (
      <div>
        <h2 className={classes.eventName}>{event.name}</h2>
        <GridContainer justify="center" className={classes.overviewContainer}>
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
            <span> Prihlásený: {event.attendees.filter(attendee => attendee.signedIn).length}</span>
            <span>, Pozvaný: {event.attendees.length}</span>
            <span>, Náhradníci: {event.attendees.filter(attendee => attendee.standIn).length}</span>
          </ItemGrid>
        </GridContainer>

        <GridContainer justify="center">
          <ItemGrid xs={12} sm={12} md={12} lg={12}>
            <div className={classes.sectionTitle}>
              {hasAlternatives ?
                <Badge color="gray" className={classes.sectionTitleBadge}>
                  <EventIcon className={classes.eventTypeIcon} />
                  <span>Termíny - možnosti</span>
                </Badge>
                 : null
              }
            </div>
            <RegularCard
              customCardClasses={classes.termsCard}
              content={
                <Table
                  noHeader
                  tableData={event.terms.map((term, index) => [
                    `${index + 1}.`,
                    <span>
                      <span>{format(parse(term.eventStartDateTime), 'DD.MM.YYYY o HH:mm')}, </span>
                      <span>{this.formatLocation(term.location)}</span>
                    </span>
                  ])}
                  customCellClasses={[
                    classes.left,
                    classes.left,
                  ]}
                  customClassesForCells={[0, 1]}
                  customHeadCellClasses={[
                    classes.left,
                    classes.left,
                  ]}
                  customHeadClassesForCells={[0, 1]}
                />
              }
            />
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

            
            <div className={classes.placeholderText}>
              {this.isDescriptionEmpty(event.description) ?
                <span>Ďalšie podrobnosti nie sú uvedené</span>
                :
                <Button size="xs" onClick={() => this.setState({ detailsOpen: !this.state.detailsOpen })}>
                  {this.state.detailsOpen ? 'Skryť detailný popis' : 'Zobraziť detailný popis'}
                </Button>
              }
            </div>
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
    groupedEvents {
      id
    }
    parentEvent {
      id
    }
    terms {
      id
      eventStartDateTime
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
