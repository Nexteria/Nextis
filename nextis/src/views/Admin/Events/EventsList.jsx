import React from 'react';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'common/store';
import Spinner from 'react-spinkit';
import { withRouter } from 'react-router-dom';
import ReactTable from 'react-table';

// @material-ui/icons
import AddIcon from '@material-ui/icons/AddCircleOutline';
import CardTravel from '@material-ui/icons/CardTravel';
import Edit from '@material-ui/icons/Edit';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import IconCard from 'components/Cards/IconCard';
import IconButton from 'components/CustomButtons/IconButton';
import Button from 'components/CustomButtons/Button';

const styles = {
  actionButton: {
    margin: '0 0 0 5px',
    padding: '5px'
  },
  actionButtonRound: {
    width: 'auto',
    height: 'auto',
    minWidth: 'auto'
  },
  icon: {
    verticalAlign: 'middle',
    width: '17px',
    height: '17px',
    top: '-1px',
    position: 'relative'
  },
  icons: {
    width: '17px',
    height: '17px',
    marginRight: '5px',
  },
};

class EventsList extends React.Component {
  render() {
    const { data, classes, history } = this.props;

    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const { events } = data;

    const tableData = events
      .map(event => ({
        name: event.name,
        status: event.status,
        actions: (
          <div className="actions-right">
            {[
              { color: 'success', icon: Edit, actionCode: 'edit' }
            ].map(prop => (
              <IconButton color={prop.color} customClass={`${classes.actionButton} ${classes.actionButtonRound}`} key={prop.actionCode}>
                <prop.icon className={classes.icon} />
              </IconButton>
            ))}
          </div>
        )
      }));

    return (
      <GridContainer>
        <ItemGrid xs={12} justify="center" container>
          <Button size="xs" color="success" onClick={() => history.push('/admin/events/new')}>
            <AddIcon className={classes.icons} />
            {' Nový event'}
          </Button>
        </ItemGrid>
        <ItemGrid xs={12}>
          <IconCard
            icon={CardTravel}
            title=""
            iconColor="orange"
            content={(
              <ReactTable
                data={tableData}
                filterable
                columns={[
                  {
                    Header: 'Názov',
                    accessor: 'name',
                  },
                  {
                    Header: 'Status',
                    accessor: 'status'
                  },
                  {
                    Header: 'Akcie',
                    accessor: 'actions',
                    sortable: false,
                    filterable: false,
                  }
                ]}
                minRows={tableData.length}
                defaultPageSize={tableData.length}
                showPagination={false}
                className="-striped -highlight"
              />
            )}
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

const eventsQuery = gql`
query FetchEvents{
  events{
    id
    name
    status
    eventType
  }
}
`;

export default compose(
  withRouter,
  connect(state => ({ user: state.user })),
  withStyles(styles),
  graphql(eventsQuery, {
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
)(EventsList);
