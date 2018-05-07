import React from "react";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from "common/store";
import { compose } from 'recompose';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import subMonths from 'date-fns/sub_months';
import addMonths from 'date-fns/add_months';
import isAfter from 'date-fns/is_after';
import isPast from 'date-fns/is_past';
import Spinner from 'react-spinkit';

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// material-ui icons
import Chat from "@material-ui/icons/Chat";
import ContentPaste from "@material-ui/icons/ContentPaste";
import HelpOutline from '@material-ui/icons/HelpOutline';

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import Timeline from "components/Timeline/Timeline.jsx";

import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";

class Overview extends React.Component {
  transformEvent(event) {
    const terms = [...event.terms].sort((a, b) => {
      return a.eventStartDateTime.localeCompare(b.eventStartDateTime);
    });

    const startDateTime = parse(terms[0].eventStartDateTime);
    const endDateTime = parse(terms[terms.length - 1].eventEndDateTime);

    const subtitle = `${format(startDateTime, 'DD.MM.YYYY, HH:mm')} - ${format(endDateTime, 'DD.MM.YYYY, HH:mm')}`;

    let card = {
      badgeColor: isPast(endDateTime) ? "success" : 'info',
      badgeIcon: HelpOutline,
      title: event.name,
      titleColor: isPast(endDateTime) ? "success" : 'info',
      subtitle,
      body: (
        <p dangerouslySetInnerHTML={{ __html: event.shortDescription }}></p>
      )
    };

    if (event.eventType === 'dbk') {
      card.badgeIcon = Chat;
    } else if (event.eventType === 'ik') {
      card.badgeIcon = ContentPaste;
    } else {
      card.badgeIcon = HelpOutline;
    }

    return card;
  }

  render() {
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    let events = [...this.props.data.events].filter(event => event.status === 'published').map(event => this.transformEvent(event));
    events.sort((a, b) => isAfter(a.startDateTime, b.startDateTime) ? 1 : -1);
    events = events.map((event, index) => {
      event.inverted = index % 2 === 1;
      return event;
    });

    return (
        <GridContainer>
        <ItemGrid xs={12}>
          <RegularCard
            plainCard
            content={
              <Timeline stories={events} />
            }
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

const EventsQuery = gql`
query FetchEvents ($from: String, $to: String){
  events (from: $from, to: $to){
    id
    name
    eventType
    status
    shortDescription
    terms (from: $from, to: $to) {
      id
      eventStartDateTime
      eventEndDateTime
    }
  }
}
`;

export default compose(
  connect(state => ({ user: state.user })),
  withStyles(extendedTablesStyle),
  graphql(EventsQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        from: format(subMonths(new Date(), 1), 'YYYY-MM-DD HH:mm:ss'),
        to: format(addMonths(new Date(), 1), 'YYYY-MM-DD HH:mm:ss'),
      },
    })
  }),
)(Overview);
