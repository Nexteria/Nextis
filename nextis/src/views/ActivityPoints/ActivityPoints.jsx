import React from "react";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import Spinner from 'react-spinkit';
import { connect } from "common/store";
import { withRouter } from "react-router-dom";

// material-ui components
import Select from "material-ui/Select";
import MenuItem from "material-ui/Menu/MenuItem";
import FormControl from "material-ui/Form/FormControl";
import InputLabel from "material-ui/Input/InputLabel";
import withStyles from "material-ui/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";

import PointsCard from "views/ActivityPoints/PointsCard.jsx";

import activityPointsStyle from "assets/jss/material-dashboard-pro-react/views/activityPointsStyle.jsx";
import ActivityPointsStatsCards from "views/ActivityPoints/ActivityPointsStatsCards.jsx";

class ActivityPoints extends React.Component {
  constructor(props) {
    super(props);

    this.handleSemesterChange = this.handleSemesterChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.semesterId !== nextProps.match.params.semesterId) {
      nextProps.data.refetch();
    }
  }

  handleSemesterChange(event) {
    const semesterId = event.target.value;
    const { history } = this.props;

    history.push(`/activity-points/${semesterId}`);
  }

  render() {
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const { classes, data } = this.props;

    const student = data.user.student;

    let selectedSemesterId = parseInt(this.props.match.params.semesterId, 10);
    if (!selectedSemesterId && student.activeSemester) {
      selectedSemesterId = student.activeSemester.id;
    }

    return (
      <div>
        <GridContainer justify="center" className={classes.semesterSelector}>
          <ItemGrid xs={12} sm={6} md={5} lg={3}>
            <FormControl
              fullWidth
              className={classes.selectFormControl}
            >
              <InputLabel
                htmlFor="active-semester"
                className={classes.selectLabel}
              >
                Vyber semester
              </InputLabel>
              <Select
                MenuProps={{
                  className: classes.selectMenu
                }}
                classes={{
                  select: classes.select
                }}
                value={selectedSemesterId}
                onChange={this.handleSemesterChange}
                inputProps={{
                  name: "activeSemester",
                  id: "active-semester"
                }}
              >
                <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem
                  }}
                >
                  Vyber semester
                </MenuItem>
                {student.semesters.map(semester =>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    key={semester.id}
                    value={semester.id}
                  >
                    {semester.name}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </ItemGrid>
        </GridContainer>
        <GridContainer>
          <ActivityPointsStatsCards
            classes={classes}
            activityPointsInfo={student.activityPointsInfo}
            unfinishedEvents={student.unfinishedEvents}
            openEventsForSignin={student.openEventsForSignin}
          />
        </GridContainer>
        <GridContainer justify="center">
          <ItemGrid xs={12} sm={12} md={10}>
            <PointsCard semesterId={selectedSemesterId} studentId={student.id} userId={this.props.user.id}/>
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}

const userQuery = gql`
query FetchUser ($id: Int, $semesterId: Int){
  user (id: $id){
    id
    student {
      id
      activityPointsInfo (semesterId: $semesterId){
        gained
        minimum
        base
      }
      openEventsForSignin(signedIn: false, semesterId: $semesterId) {
        id
        activityPoints
        name
      }
      unfinishedEvents (semesterId: $semesterId) {
        id
        activityPoints
        name
        attendees (userId: $id) {
          id
          signedIn
          filledFeedback
          terms {
            id
            attendees (userId: $id) {
              id
              signedIn
              filledFeedback
              feedbackDeadlineAt
            }
          }
        }
      }
      semesters {
        id
        name
      }
      activeSemester {
        id
      }
    }
  }
}
`;

export default compose(
  connect(state => ({ user: state.user, student: state.student })),
  withStyles(activityPointsStyle),
  withRouter,
  graphql(userQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.user.id,
        semesterId: parseInt(props.match.params.semesterId, 10) || props.student.activeSemesterId,
      },
    })
  }),
)(ActivityPoints);