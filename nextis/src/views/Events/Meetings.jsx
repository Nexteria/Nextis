import React from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'common/store';
import { compose } from 'recompose';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import Spinner from 'react-spinkit';
import { withRouter } from 'react-router-dom';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

// material-ui icons
import Info from '@material-ui/icons/Info';

// core components
import Table from 'components/Table/Table';
import Button from 'components/CustomButtons/Button';
import ItemGrid from 'components/Grid/ItemGrid';
import RegularCard from 'components/Cards/RegularCard';
import { meetingsQuery } from 'views/Events/Queries';

import extendedTablesStyle from 'assets/jss/material-dashboard-pro-react/views/extendedTablesStyle';

class Meetings extends React.Component {
  transformTerm(term) {
    const { classes, history } = this.props;

    const startDateTimeString = format(parse(term.eventStartDateTime), 'DD.MM.YYYY o HH:mm');
    let fillButtons = [
      { color: 'info', icon: Info, action: () => history.push(`/events/${term.event.id}`) },
    ];

    if (term.attendees[0].signedIn && term.attendees[0].signedIn !== '') {
      fillButtons.push({ color: 'danger', text: 'Odhlásiť', action: () => history.push(`/events/${term.event.id}/terms/${term.id}/signOut`) });
    }

    fillButtons = fillButtons.map((prop, key) => {
      return (
        <Button color={prop.color} customClass={classes.actionButton} key={key} onClick={prop.action || null}>
          {prop.icon ? <prop.icon className={classes.icon} /> : null}
          {prop.text ? prop.text : null}
        </Button>
      );
    });

    return [
      term.event.name,
      startDateTimeString,
      `${term.location.name}, ${term.location.addressLine1}${term.location.addressLine2 ? ', ' + term.location.addressLine2 : ''}`,
      fillButtons
    ];
  }

  render() {
    const { classes, data, history } = this.props;
    
    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const meetings = this.props.data.student.meetings.filter(term => term.attendees[0].signedIn !== '' && term.attendees[0].signedIn !== null);

    return (
      <div>
        <h3>Tvoje stretnuia, na ktoré si sa záväzne prihlásil</h3>
        <ItemGrid xs={12}>
          <RegularCard
            content={
              meetings.length ?
                <Table
                  tableHead={[
                    "Názov eventu",
                    "Dátum konania",
                    "Miesto",
                    "Akcie"
                  ]}
                  tableData={
                    [...meetings].sort((a, b) => {
                      return a.eventStartDateTime.localeCompare(b.eventStartDateTime);
                    }).map(term =>
                      this.transformTerm(term, classes, history)
                    )
                  }
                  customCellClasses={[
                    classes.left,
                    classes.center,
                    classes.center
                  ]}
                  customClassesForCells={[0, 1, 2]}
                  customHeadCellClasses={[
                    classes.left,
                    classes.center,
                    classes.center
                  ]}
                  customHeadClassesForCells={[0, 1, 2]}
                />
                :
                <h4 className={classes.center}>Momentálne Ťa nečakajú žiadne stretnutia!</h4>
            }
          />
        </ItemGrid>
      </div>
    );
  }
}

export default compose(
  connect(state => ({ user: state.user })),
  withStyles(extendedTablesStyle),
  graphql(meetingsQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.user.studentId,
        userId: props.user.id,
      },
    })
  }),
  withRouter,
)(Meetings);
