import React from "react";


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
      return 'event';
    } else if (count === 0 || count > 4) {
      return 'event-ov';
    } else {
      return 'event-y';
    }
  }

  render() {
    const { classes, activityPointsInfo, unfinishedEvents, openEventsForSignin } = this.props;

    const isBelowMinimum = activityPointsInfo.gained < activityPointsInfo.minimum;

    const eventsForSignInPoints = openEventsForSignin.reduce((reduction, event) => reduction + event.activityPoints, 0);
    const unfinishedEventsPoints = unfinishedEvents.reduce((reduction, event) => reduction + event.activityPoints, 0);

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
                <span> / {activityPointsInfo.base}</span>
              </span>
            }
            statIcon={Warning}
            descriptionColor={'gray'}
            smallColor={'gray'}
            statText={`75% z Tvojho bodového základu: ${activityPointsInfo.minimum}`}
          />
        </ItemGrid>
        <ItemGrid xs={12} sm={6} md={6} lg={4}>
          <StatsCard
            icon={Accessibility}
            iconColor="orange"
            title="Možné body za eventy na ktoré si prihlásený/á"
            description={`+ ${unfinishedEventsPoints}`}
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
            title="Možné body za aktivity na ktoré sa môžeš prihlásiť"
            description={`+ ${eventsForSignInPoints}`}
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