import React from "react";
import { withRouter } from "react-router-dom";
import { graphql } from 'react-apollo';
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
import Info from "@material-ui/icons/Info";
import HelpOutline from '@material-ui/icons/HelpOutline';
import ExposurePlus2 from '@material-ui/icons/ExposurePlus2';
import CallSplit from '@material-ui/icons/CallSplit';
import EventIcon from '@material-ui/icons/Event';

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import Timeline from "components/Timeline/Timeline.jsx";
import Button from "components/CustomButtons/Button.jsx";

import { overviewQuery } from 'views/Events/Queries';

import eventsOverviewStyle from "assets/jss/material-dashboard-pro-react/views/eventsOverviewStyle.jsx";

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.loadOlder = this.loadOlder.bind(this);
  }

  state = {
    from: format(subMonths(new Date(), 1), 'YYYY-MM-DD HH:mm:ss'),
    to: format(addMonths(new Date(), 1), 'YYYY-MM-DD HH:mm:ss'),
    noPastEventsCounter: 0,
  };

  loadOlder() {
    const { data } = this.props;
    const fetchMore = data.fetchMore;

    fetchMore({
      query: overviewQuery,
      variables: {
        from: format(subMonths(this.state.from, 1), 'YYYY-MM-DD HH:mm:ss'),
        to: format(this.state.from, 'YYYY-MM-DD HH:mm:ss'),
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult.events.length) {
          this.setState({noPastEventsCounter: this.state.noPastEventsCounter + 1 });
        }

        return {
          events: [...previousResult.events, ...fetchMoreResult.events],
        };
      },
    }).then((data) => {
      this.setState({ from: subMonths(this.state.from, 1) });
      return data;
    });
  }

  transformEvent(event, classes, history) {
    const terms = [...event.terms].sort((a, b) => {
      return a.eventStartDateTime.localeCompare(b.eventStartDateTime);
    });

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
    const hasEventChoices = event.groupedEvents.length || (event.parentEvent && event.parentEvent.id);
    const isMultiMeeting = Object.keys(parentTerms).length >= 1;

    const startDateTime = parse(terms[0].eventStartDateTime);
    const endDateTime = parse(terms[terms.length - 1].eventEndDateTime);

    const subtitle = `${format(startDateTime, 'DD.MM.YYYY, HH:mm')} - ${format(endDateTime, 'DD.MM.YYYY, HH:mm')}`;

    let color = "";
    if (isPast(endDateTime)) {
      // past events
      color = "success";
    } else if (isPast(startDateTime)) {
      // ongoing events
      color = "warning";
    } else {
      // future events
      color = "info";
    }

    let card = {
      badgeColor: color,
      badgeIcon: HelpOutline,
      title: event.name,
      titleColor: color,
      inverted: true,
      subtitle,
      body: (
        <p dangerouslySetInnerHTML={{ __html: event.shortDescription }}></p>
      ),
      startDateTime,
      endDateTime,
      footer: (
        <div className={classes.timelineButtonContainer}>
          <GridContainer>
            <ItemGrid xs={12} md={9}>
              {isMultiMeeting ?
                <Button disabled color={color} customClass={classes.actionButton}>
                  <ExposurePlus2 />
                  <div className={classes.indicatorButtonText}>Viacdielny</div>
                </Button>
                : null
              }
              {hasAlternatives ? 
              <Button disabled color={color} customClass={classes.actionButton}>
                <EventIcon />
                <div className={classes.indicatorButtonText}>Vyber si termín</div>
              </Button>
                : null
              }
              {hasEventChoices ? 
              <Button disabled color={color} customClass={classes.actionButton}>
                <CallSplit />
                <div className={classes.indicatorButtonText}>Alternatíva</div>
              </Button>
                : null
              }
            </ItemGrid>
            <ItemGrid xs={12} md={3} className={classes.infoButtonContainer}>
              <Button
                color={color}
                customClass={classes.actionButton + " " + classes.infoButton}
                onClick={() => history.push(`/events/${event.id}`)}
              >
                <Info />
              </Button>
            </ItemGrid>
          </GridContainer>
        </div>
      ),
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

    const { classes } = this.props;

    let events = [...this.props.data.events].filter(event => event.status === 'published')
      .map(event => this.transformEvent(event, classes, this.props.history));

    events.sort((a, b) => isAfter(a.startDateTime, b.startDateTime) ? -1 : 1);

    return (
        <div>
          <ItemGrid xs={12}>
            <RegularCard
              plainCard
              customCardClasses={classes.noTopMarginCard}
              content={
                <Timeline simple stories={events} />
              }
            />
          </ItemGrid>

          <ItemGrid xs={12} className={classes.loadingButton}>
            {this.state.noPastEvents >= 3 ?
                <Button disabled color="info">
                  Tu je začiatok
                </Button>
                :
                <Button
                  color="white"
                  onClick={this.loadOlder}
                >
                  Načítať predchádzajúci mesiac
                </Button>
              }
          </ItemGrid>
      </div>
    );
  }
}

export default compose(
  connect(state => ({ user: state.user })),
  withStyles(eventsOverviewStyle),
  graphql(overviewQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        from: format(subMonths(new Date(), 1), 'YYYY-MM-DD HH:mm:ss'),
        to: format(addMonths(new Date(), 1), 'YYYY-MM-DD HH:mm:ss'),
      },
    })
  }),
  withRouter,
)(Overview);
