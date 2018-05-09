import React from "react";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import ReactTable from "react-table";
import Spinner from 'react-spinkit';
import download from 'downloadjs';
import request from "common/fetch";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// @material-ui/icons
import ListIcon from "@material-ui/icons/List";
import FeedbackIcon from "@material-ui/icons/Feedback";
import TodayIcon from "@material-ui/icons/Today";
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import Info from "@material-ui/icons/Info";
import ContactsIcon from "@material-ui/icons/Contacts";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";

import IconCard from "components/Cards/IconCard.jsx";
import IconButton from "components/CustomButtons/IconButton.jsx";
import Button from "components/CustomButtons/Button.jsx";

import contactsStyle from "assets/jss/material-dashboard-pro-react/views/contactsStyle.jsx";

class Contacts extends React.Component {
  handleDownloadContactsRequest() {
    request('/api/contacts', {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.blob())
    .then(blob => download(blob, 'kontakty.vcf', 'text/vcard'))
  }

  render() {
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const { classes } = this.props;

    const students = this.props.data.students;
    const data = students.map(student => ({
      name: `${student.lastName} ${student.firstName}`,
      email: student.user.email || "",
      level: student.level.name,
      phone: student.user.phone || "",
      actions: (
        <div className="actions-right">
          <Button color="warning" customClass={classes.actionButton}>
            <Info />
          </Button>
        </div>
      )
    })).sort((a, b) => {
      if (a.level === b.level) {
        return a.name.localeCompare(b.name);
      } else {
        return a.level.localeCompare(b.level);
      }
    })

    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={12} md={12} lg={8}>
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
                        filter.value.localeCompare(row[column.id].slice(0, filter.value.length), "sk", {sensitivity: 'base'}) === 0
                      }
                      columns={[
                          {
                            Header: "Meno",
                            accessor: "name",
                          },
                          {
                            Header: "Email",
                            accessor: "email"
                          },
                          {
                            Header: "Level",
                            accessor: "level"
                          },
                          {
                            Header: "Telefón",
                            headerStyle: { textAlign: 'left' },
                            accessor: "phone"
                          },
                          {
                            Header: "",
                            headerStyle: { textAlign: 'center' },
                            accessor: "actions",
                            sortable: false,
                            filterable: false,
                          }
                      ]}
                      showPaginationTop={false}
                      showPaginationBottom
                      showPageSizeOptions={false}
                      className="-striped -highlight"
                    />
                }
            />
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={12} lg={8} className={classes.center}>
         <Button color="warning" onClick={this.handleDownloadContactsRequest}>
            <span>Stiahnuť kontakty vo formáte vCard</span>
          </Button>
        </ItemGrid>
      </GridContainer>
    );
  }
}

const StudentsQuery = gql`
query FetchStudents ($status: String) {
  students (status: $status){
    id
    firstName
    lastName
    level {
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
      },
    })
  }),
)(Contacts);