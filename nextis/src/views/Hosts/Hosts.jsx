import React from 'react';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'common/store';
import Spinner from 'react-spinkit';
import { Route, withRouter } from 'react-router-dom';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import request from 'common/fetch';
import download from 'downloadjs';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import RegularCard from 'components/Cards/RegularCard';
import IconButton from 'components/CustomButtons/IconButton';
import Table from 'components/Table/Table';

import CheckAttendeesIcon from '@material-ui/icons/DoneOutline';
import DownloadAttendeesIcon from '@material-ui/icons/AssignmentInd';

import AttendanceCheck from 'views/Hosts/AttendanceCheck';

import hostStyles from 'assets/jss/material-dashboard-pro-react/views/hostStyles';

function handleDownloadAttendees(termId) {
  request(`/api/terms/${termId}/hostlist`, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.blob())
    .then(blob => download(blob, 'attendees.pdf', 'application/pdf'));
}

class Hosts extends React.Component {
  constructor(props) {
    super(props);

    this.transformTerm = this.transformTerm.bind(this);
  }

  transformTerm(term) {
    const { history, classes } = this.props;

    return [
      format(parse(term.eventStartDateTime), 'DD.MM.YYYY o HH:mm'),
      term.location.name,
      term.event.name,
      <div className="actions-right">
        {[
          {
            color: 'info',
            icon: DownloadAttendeesIcon,
            actionCode: 'downloadAttendees',
            onClick: () => handleDownloadAttendees(term.id)
          },
          {
            color: 'primary',
            icon: CheckAttendeesIcon,
            actionCode: 'checkAttendees',
            onClick: () => history.push(`/host/terms/${term.id}`)
          }
        ].map(prop => (
          <IconButton
            color={prop.color}
            customClass={`${classes.actionButton} ${classes.actionButtonRound}`}
            key={prop.actionCode}
            onClick={prop.onClick ? prop.onClick : null}
          >
            <prop.icon className={classes.icon} />
          </IconButton>
        ))}
      </div>,
    ];
  }

  render() {
    const { data, classes } = this.props;

    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const { user } = data;

    const terms = user.hostedTerms
      .sort((a, b) => parse(a.eventStartDateTime) - parse(b.eventStartDateTime))
      .map(this.transformTerm);

    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={12} md={12} lg={12}>
          <RegularCard
            customCardClasses={classes.noTopMarginCard}
            content={
              user.hostedTerms.length ? (
                <Table
                  tableHead={[
                    'Dátum stretnutia',
                    'Miesto stretnutia',
                    'Názov eventu',
                    'Akcie'
                  ]}
                  tableData={[...terms]}
                  customCellClasses={[
                    classes.left,
                    `${classes.left} ${classes.centerMobile}`,
                    classes.center,
                  ]}
                  customClassesForCells={[0, 1, 2, 3]}
                  customHeadCellClasses={[
                    classes.left,
                    `${classes.left} ${classes.centerMobile}`,
                    `${classes.center} ${classes.actionButtons}`,
                  ]}
                  customHeadClassesForCells={[0, 1, 2, 3]}
                />
              ) : (
                <h4 className={classes.center}>
                  Momentálne nie si hostom na žiadnom stretnutí!
                </h4>
              )
            }
          />
        </ItemGrid>

        <Route
          path="/host/terms/:termId"
          exact
          component={AttendanceCheck}
        />
      </GridContainer>
    );
  }
}

const userQuery = gql`
query FetchUser ($id: Int){
  user (id: $id) {
    id
    hostedTerms (onlyActive: true) {
      id
      eventStartDateTime
      event {
        id
        name
      }
      location {
        id
        name
      }
    }
  }
}
`;

export default compose(
  withRouter,
  connect(state => ({ user: state.user })),
  withStyles(hostStyles),
  graphql(userQuery, {
    options: (props) => {
      const { user } = props;

      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          id: user.id,
        },
      };
    }
  }),
)(Hosts);
