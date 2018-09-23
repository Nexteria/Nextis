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
import Accessibility from '@material-ui/icons/Accessibility';
import Edit from '@material-ui/icons/Edit';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import IconCard from 'components/Cards/IconCard';
import IconButton from 'components/CustomButtons/IconButton';

import StudentsActionsContainer from 'views/Admin/Students/StudentsActionsContainer';

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

class StudentsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selected: {}, selectAll: 0 };

    this.toggleRow = this.toggleRow.bind(this);
    this.toggleSelectAll = this.toggleSelectAll.bind(this);
  }

  toggleRow(id) {
    const { selected } = this.state;

    const newSelected = Object.assign({}, selected);
    if (selected[id]) {
      delete newSelected[id];
    } else {
      newSelected[id] = true;
    }

    this.setState({
      selected: newSelected,
      selectAll: 2
    });
  }

  toggleSelectAll() {
    const { selectAll } = this.state;
    const { data } = this.props;

    const newSelected = {};

    if (selectAll === 0) {
      data.students.forEach((student) => {
        newSelected[student.id] = true;
      });
    }

    this.setState({
      selected: newSelected,
      selectAll: selectAll === 0 ? 1 : 0
    });
  }

  render() {
    const { data, classes } = this.props;

    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const { selected, selectAll } = this.state;
    const { students } = data;

    const tableData = students
      .map(student => ({
        fullName: `${student.firstName} ${student.lastName}`,
        level: student.level ? student.level.name : '-',
        status: student.status,
        id: student.id,
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
        <ItemGrid xs={12}>
          <IconCard
            icon={Accessibility}
            title=""
            iconColor="orange"
            content={(
              <ReactTable
                data={tableData}
                filterable
                columns={[
                  {
                    id: 'checkbox',
                    accessor: '',
                    Cell: ({ original }) => (
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selected[original.id] === true}
                        onChange={() => this.toggleRow(original.id)}
                      />
                    ),
                    Header: () => (
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectAll === 1}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = selectAll === 2;
                          }
                        }}
                        onChange={() => this.toggleSelectAll()}
                      />
                    ),
                    sortable: false,
                    width: 45
                  },
                  {
                    Header: 'Meno a priezvisko',
                    accessor: 'fullName',
                  },
                  {
                    Header: 'Level',
                    accessor: 'level'
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
                defaultPageSize={10}
                className="-striped -highlight"
              />
            )}
          />
        </ItemGrid>

        <ItemGrid xs={12}>
          <StudentsActionsContainer selectedStudents={selected} />
        </ItemGrid>
      </GridContainer>
    );
  }
}

const eventsQuery = gql`
query FetchStudents {
  students {
    id
    firstName
    lastName
    status
    level {
      id
      name
    }
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
)(StudentsList);
