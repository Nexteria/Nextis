import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Card from "material-ui/Card";
import CardContent from "material-ui/Card/CardContent";
import CardHeader from "material-ui/Card/CardHeader";
import Typography from "material-ui/Typography";
import Tabs from "material-ui/Tabs";
import Tab from "material-ui/Tabs/Tab";

// core components
import Tasks from "components/Tasks/Tasks.jsx";

import tasksCardStyle from "assets/jss/material-dashboard-pro-react/components/tasksCardStyle";

class TasksCard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { classes, headerColor, title, tabs, rtlActive } = this.props;
    const cardHeader =
      classes.cardHeader +
      " " +
      classes[headerColor + "CardHeader"] +
      " " +
      cx({
        [classes.cardHeaderRTL]: rtlActive
      });
    const cardTitle =
      classes.cardTitle +
      " " +
      cx({
        [classes.cardTitleRTL]: rtlActive
      });
    const tabsContainer =
      classes.tabsContainer +
      " " +
      cx({
        [classes.tabsContainerRTL]: rtlActive
      });
    const tabWrapper =
      classes.tabWrapper +
      " " +
      cx({
        [classes.tabWrapperRTL]: rtlActive
      });
    const tabIcon =
      classes.tabIcon +
      " " +
      cx({
        [classes.tabIconRTL]: rtlActive
      });
    const labelContainer = cx({ [classes.labelContainerRTL]: rtlActive });
    const labelIcon =
      classes.labelIcon +
      " " +
      cx({
        [classes.labelIconRTL]: rtlActive
      });
    return (
      <Card className={classes.card}>
        <CardHeader
          classes={{
            root: cardHeader,
            title: cardTitle,
            content: classes.cardHeaderContent
          }}
          title={title}
          action={
            <Tabs
              classes={{
                flexContainer: tabsContainer,
                indicator: classes.displayNone
              }}
              value={this.state.value}
              onChange={this.handleChange}
              textColor="inherit"
            >
              {tabs.map((prop, key) => {
                return (
                  <Tab
                    key={key}
                    classes={{
                      wrapper: tabWrapper,
                      labelIcon: labelIcon,
                      label: classes.label,
                      textColorInheritSelected: classes.textColorInheritSelected,
                      labelContainer: labelContainer
                    }}
                    icon={<prop.tabIcon className={tabIcon} />}
                    label={prop.tabName}
                  />
                );
              })}
            </Tabs>
          }
        />
        <CardContent>
          {tabs.map((prop, key) => {
            if (key === this.state.value) {
              return (
                <Typography component="div" key={key}>
                  <Tasks
                    rtlActive={rtlActive}
                    checkedIndexes={prop.tabTasksChekedIndexes}
                    tasksIndexes={prop.tabTasksIndexes}
                    tasks={prop.tabTasks}
                  />
                </Typography>
              );
            }
            return null;
          })}
        </CardContent>
      </Card>
    );
  }
}

TasksCard.defaultProps = {
  headerColor: "purple"
};

TasksCard.propTypes = {
  classes: PropTypes.object.isRequired,
  headerColor: PropTypes.oneOf([
    "orange",
    "green",
    "red",
    "blue",
    "purple",
    "rose"
  ]),
  title: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string.isRequired,
      tabIcon: PropTypes.func.isRequired,
      tabTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
      tabTasksIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
      tabTasksChekedIndexes: PropTypes.arrayOf(PropTypes.number).isRequired
    })
  ),
  rtlActive: PropTypes.bool
};

export default withStyles(tasksCardStyle)(TasksCard);
