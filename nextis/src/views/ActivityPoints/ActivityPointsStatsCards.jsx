import React from "react";
import isPast from 'date-fns/is_past';
import isAfter from 'date-fns/is_after';
import parse from 'date-fns/parse';


// @material-ui/icons
import Warning from "@material-ui/icons/Warning";
import Accessibility from "@material-ui/icons/Accessibility";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";

import StatsCard from "components/Cards/StatsCard.jsx";


class ActivityPointsStatsCards extends React.Component {
  transformEventWord(count) {
    if (count === 1) {
      return 'aktivitu';
    } else if (count === 0 || count > 4) {
      return 'aktivity';
    } else {
      return 'aktivít';
    }
  }

  computeUnfinishedEventPoints(events) {
    return events.reduce((reduction, event) => {
      let activityPoints = event.activityPoints;

      event.attendees.some(attendee => {
        if (attendee.signedIn) {
          return attendee.terms.some(term => {
            const termAttendee = term.attendees[0];

            const feedbackDeadlineAt = parse(termAttendee.feedbackDeadlineAt);

            if (isPast(feedbackDeadlineAt)) {
              if (!termAttendee.filledFeedback) {
                activityPoints = Math.floor(activityPoints * 0.9);
                return true;
              } else {
                const filledFeedback = parse(termAttendee.filledFeedback);
                if (isAfter(filledFeedback, feedbackDeadlineAt)) {
                  activityPoints = Math.floor(activityPoints * 0.9);
                  return true;
                }
              }
            }
            return false;
          });
        }

        return false;
      });

      return reduction + activityPoints
    }, 0);
  }

  render() {
    const { classes, activityPointsInfo, unfinishedEvents, openEventsForSignin } = this.props;

    const isBelowMinimum = activityPointsInfo.gained < activityPointsInfo.minimum;

    const eventsForSignInPoints = openEventsForSignin.reduce((reduction, event) => reduction + event.activityPoints, 0);
    const unfinishedEventsPoints = this.computeUnfinishedEventPoints(unfinishedEvents);

    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={6} md={6} lg={4}>
          <StatsCard
            icon={Accessibility}
            iconColor="orange"
            title="Získané body"
            description={
              <span>
                <span className={classes[isBelowMinimum ? 'negative' : 'positive']}>
                  {activityPointsInfo.gained}
                </span>
                <span> / {activityPointsInfo.base || '-'}</span>
              </span>
            }
            statIcon={Warning}
            descriptionColor={'gray'}
            smallColor={'gray'}
            statText={`75% z Tvojho bodového základu: ${activityPointsInfo.minimum || '-'}`}
          />
        </ItemGrid>
        <ItemGrid xs={12} sm={6} md={6} lg={4}>
          <StatsCard
            icon={Accessibility}
            iconColor="orange"
            title="Možné body po absolvovaní aktivít, na ktoré si prihlásený/á"
            description={`${unfinishedEventsPoints + activityPointsInfo.gained} / ${activityPointsInfo.base || '-'}`}
            statIcon={Warning}
            descriptionColor={'gray'}
            smallColor={'gray'}
            statText={`Práve si prihlásený na ${unfinishedEvents.length} ${this.transformEventWord(unfinishedEvents.length)}`}
          />
        </ItemGrid>
        <ItemGrid xs={12} sm={6} md={6} lg={4}>
          <StatsCard
            icon={Accessibility}
            iconColor="orange"
            title="Možné body po absolvovaní aktivít, na ktoré sa môžeš prihlásiť"
            description={`${unfinishedEventsPoints + activityPointsInfo.gained + eventsForSignInPoints} / ${activityPointsInfo.base || '-'}`}
            statIcon={Warning}
            descriptionColor={'gray'}
            smallColor={'gray'}
            statText={`Práve je pre teba otvorené prihlasovanie na: ${openEventsForSignin.length} ${this.transformEventWord(openEventsForSignin.length)}`}
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default ActivityPointsStatsCards;