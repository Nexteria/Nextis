import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Accessibility from "@material-ui/icons/Accessibility";
import CardTravel from "@material-ui/icons/CardTravel";

// core components
import ActivityPointsListTable from "views/ActivityPoints/ActivityPointsListTable.jsx";

import pointsCardStyle from "assets/jss/material-dashboard-pro-react/views/pointsCardStyle";
import EventsListTable from "views/ActivityPoints/EventsListTable.jsx";

class PointsCard extends React.Component {
  state = {
    tab: 'points'
  };

  handleChange = (event, tab) => {
    this.setState({ tab });
  };

  render() {
    const { classes, headerColor, title, semesterId, studentId, userId } = this.props;
    const cardHeader =
      classes.cardHeader +
      " " +
      classes[headerColor + "CardHeader"];
  
    return (
      <Card className={classes.card}>
        <CardHeader
          classes={{
            root: cardHeader,
            title: classes.cardTitle,
            content: classes.cardHeaderContent
          }}
          title={title}
          action={
            <Tabs
              classes={{
                flexContainer: classes.tabsContainer,
                indicator: classes.displayNone
              }}
              value={this.state.tab}
              onChange={this.handleChange}
              textColor="inherit"
            >
              <Tab
                classes={{
                  wrapper: classes.tabWrapper,
                  labelIcon: classes.labelIcon,
                  label: classes.label,
                  selected: classes.textColorInheritSelected,
                }}
                icon={<Accessibility className={classes.tabIcon} />}
                label={'Aktivity body'}
                value="points"
              />
              <Tab
                classes={{
                  wrapper: classes.tabWrapper,
                  labelIcon: classes.labelIcon,
                  label: classes.label,
                  selected: classes.textColorInheritSelected,
                }}
                icon={<CardTravel className={classes.tabIcon} />}
                label={'Eventy'}
                value="events"
              />
            </Tabs>
          }
        />
        <CardContent>
          <Typography component="div">
            {this.state.tab === 'points' ?
              <ActivityPointsListTable semesterId={semesterId} studentId={studentId} classes={classes} />
              :
              <EventsListTable semesterId={semesterId} userId={userId} classes={classes} />
            }
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

PointsCard.defaultProps = {
  headerColor: "orange"
};

PointsCard.propTypes = {
  classes: PropTypes.object.isRequired,
  semesterId: PropTypes.number.isRequired,
  studentId: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};

export default withStyles(pointsCardStyle)(PointsCard);
