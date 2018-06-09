import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import ReactTable from 'react-table';
import Spinner from 'react-spinkit';
import download from 'downloadjs';
import { Route } from 'react-router-dom';
import request from 'common/fetch';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

// @material-ui/icons
import Info from '@material-ui/icons/Info';
import ContactsIcon from '@material-ui/icons/Contacts';

// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import ItemGrid from 'components/Grid/ItemGrid.jsx';

import IconCard from 'components/Cards/IconCard.jsx';
import Button from 'components/CustomButtons/Button.jsx';
import UserInfoModal from 'views/Contacts/UserInfoModal.jsx';

import contactsStyle from 'assets/jss/material-dashboard-pro-react/views/contactsStyle.jsx';

class Contacts extends React.Component {
  handleDownloadContactsRequest() {
    request('/api/contacts', {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.blob())
      .then(blob => download(blob, 'kontakty.vcf', 'text/vcard'));
  }

  getColumns() {
    let columns = [];

    columns.push({
      Header: 'Meno',
      accessor: 'name'
    });

    if (window.innerWidth > 600) {
      columns.push({
        Header: 'Email',
        accessor: 'email',
        width: 250
      });

      columns.push({
        Header: 'Level',
        accessor: 'level'
      });
    }

    columns.push({
      Header: 'Telefón',
      headerStyle: { textAlign: 'left' },
      accessor: 'phone'
    });

    columns.push({
      Header: '',
      accessor: 'actions',
      sortable: false,
      filterable: false,
      maxWidth: 100
    });

    return columns;
  }

  formatPhone(number) {
    if (!number) {
      return '';
    }

    if (number.length === 13) {
      return `${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(
        7,
        10
      )} ${number.slice(10)}`;
    } else {
      return number;
    }
  }

  render() {
    if (this.props.data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const { classes, history } = this.props;

    const students = this.props.data.students;
    const data = students
      .map(student => ({
        name: `${student.lastName} ${student.firstName}`,
        email: student.user.email || '',
        level: `${student.level.name} (${
          student.startingYear
        } - ${student.endYear || ' '})`,
        phone: this.formatPhone(student.user.phone),
        actions: (
          <div
            className={
              window.innerWidth > 600 ? 'actions-right' : 'actions-center'
            }
          >
            <Button
              color="warning"
              customClass={classes.actionButton}
              onClick={() => history.push(`/contacts/${student.user.id}`)}
            >
              <Info />
            </Button>
          </div>
        )
      }))
      .sort((a, b) => {
        if (a.level === b.level) {
          return a.name.localeCompare(b.name);
        } else {
          return a.level.localeCompare(b.level);
        }
      });

    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={12} md={12} lg={10}>
          <IconCard
            icon={ContactsIcon}
            title=""
            iconColor="orange"
            content={
              <ReactTable
                data={data}
                filterable
                defaultPageSize={20}
                defaultFilterMethod={(filter, row, column) =>
                  filter.value.localeCompare(
                    row[column.id].slice(0, filter.value.length),
                    'sk',
                    { sensitivity: 'base' }
                  ) === 0
                }
                columns={this.getColumns()}
                showPaginationTop={false}
                showPaginationBottom
                showPageSizeOptions={false}
                showPageJump={false}
                className={'-striped -highlight ' + classes.contactsTable}
              />
            }
          />
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={12} lg={8} className={classes.center}>
          <Button color="warning" onClick={this.handleDownloadContactsRequest}>
            <span>Stiahnuť kontakty vo formáte vCard</span>
          </Button>
        </ItemGrid>

        <Route exact path={'/contacts/:userId'} component={UserInfoModal} />
      </GridContainer>
    );
  }
}

const StudentsQuery = gql`
  query FetchStudents($status: String) {
    students(status: $status) {
      id
      firstName
      lastName
      startingYear
      endYear
      level {
        id
        name
      }
      user {
        id
        email
        phone
      }
    }
  }
`;

export default compose(
  withStyles(contactsStyle),
  graphql(StudentsQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        status: 'active'
      }
    })
  })
)(Contacts);
