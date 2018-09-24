import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import Spinner from 'react-spinkit';
import { connect } from 'common/store';
import { withRouter } from 'react-router-dom';
import parse from 'date-fns/parse';
import isAfter from 'date-fns/is_after';

// material-ui components
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import withStyles from '@material-ui/core/styles/withStyles';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';

import PointsCard from 'views/ActivityPoints/PointsCard';

import activityPointsStyle from 'assets/jss/material-dashboard-pro-react/views/activityPointsStyle';
import ActivityPointsStatsCards from 'views/ActivityPoints/ActivityPointsStatsCards';

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
    const {
      data,
      classes,
      match,
      user,
    } = this.props;

    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const { student } = data.user;

    let selectedSemesterId = parseInt(match.params.semesterId, 10);
    if (!selectedSemesterId && student && student.activeSemester) {
      selectedSemesterId = student.activeSemester.id;
    }

    let openEventsForSignin = [];

    if (student) {
      openEventsForSignin = data.user.eventsWithInvitation.filter((event) => {
        const attendee = event.attendees[0];
        const signinOpeningDate = parse(attendee.signInOpenDateTime);
        const signinClosingDate = parse(attendee.signInCloseDateTime);

        const now = new Date();

        return isAfter(now, signinOpeningDate) && isAfter(signinClosingDate, now);
      });
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
                  name: 'activeSemester',
                  id: 'active-semester'
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
                {student ? student.semesters.map(semester => (
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
                )) : null}
              </Select>
            </FormControl>
          </ItemGrid>
        </GridContainer>
        <GridContainer>
          {student && (
            <ActivityPointsStatsCards
              classes={classes}
              activityPointsInfo={student ? student.activityPointsInfo : null}
              unfinishedEvents={student ? student.unfinishedEvents : null}
              openEventsForSignin={student ? openEventsForSignin : null}
            />
          )}
        </GridContainer>
        <GridContainer justify="center">
          <ItemGrid xs={12} sm={12} md={10}>
            {student && <PointsCard semesterId={selectedSemesterId} studentId={student.id} userId={user.id} />}
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}

const userQuery = gql`
query FetchUser ($id: Int!, $semesterId: Int){
  user (id: $id){
    id
    eventsWithInvitation(signedIn: false, semesterId: $semesterId) {
      id
      activityPoints
      name
      attendees (userId: $id) {
        id
        signInOpenDateTime
        signInCloseDateTime
      }
    }
    student {
      id
      activityPointsInfo (semesterId: $semesterId){
        gained
        minimum
        base
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
    options: (props) => {
      const { student, match, user } = props;

      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          id: user.id,
          semesterId: parseInt(match.params.semesterId, 10) || (student ? student.activeSemesterId : 0),
        },
      };
    }
  }),
)(ActivityPoints);
