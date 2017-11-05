import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import diacritics from 'diacritics';
import { browserHistory } from 'react-router';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

import { fields } from '../../common/lib/redux-fields/index';
import UserProfileDialog from './UserProfileDialog';
import * as actions from '../../common/users/actions';
import './ContactList.scss';

const messages = defineMessages({
  title: {
    defaultMessage: 'Contact list',
    id: 'contacts.list.title'
  },
  no_contacts: {
    defaultMessage: 'No contacts here',
    id: 'contacts.list.no_contacts'
  },
  contactStudentsTitile: {
    defaultMessage: 'Contacts - students',
    id: 'contacts.list.contactStudentsTitile'
  },
  firstName: {
    defaultMessage: 'First name',
    id: 'contacts.list.firstName',
  },
  lastName: {
    defaultMessage: 'Last name',
    id: 'contacts.list.lastName',
  },
  email: {
    defaultMessage: 'Email',
    id: 'contacts.list.email',
  },
  phone: {
    defaultMessage: 'Phone',
    id: 'contacts.list.phone',
  },
});

class ContactList extends Component {

  static propTypes = {
    users: PropTypes.object,
    rolesList: PropTypes.object,
    fields: PropTypes.object,
    user: PropTypes.number,
    intl: PropTypes.object.isRequired,
    studentLevels: PropTypes.object.isRequired,
    downloadContacts: PropTypes.func.isRequired,
  };

  render() {
    const { users, rolesList, downloadContacts, studentLevels, fields, user } = this.props;
    const { formatMessage } = this.props.intl;

    let students = users;
    if (users) {
      students = users.filter(user => user.roles.includes(rolesList.get('STUDENT').id));

      if (fields.filter.value) {
        students = students.filter(user =>
          diacritics.remove(`${user.firstName} ${user.lastName}`).toLowerCase()
            .indexOf(diacritics.remove(fields.filter.value.toLowerCase())) !== -1
        );
      }
    }

    const phoneUtil = PhoneNumberUtil.getInstance();

    const contactsData = students.valueSeq().map(student => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: phoneUtil.format(phoneUtil.parse(student.phone), PhoneNumberFormat.INTERNATIONAL),
      level: studentLevels.getIn([student.studentLevelId, 'name']),
    })).toArray();

    return (
      <div>
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <div className="box-header">
                  <h3 className="box-title">
                    <FormattedMessage{...messages.contactStudentsTitile} />
                  </h3>

                  <div className="box-tools">
                    <div className="input-group input-group-sm" style={{ width: '150px' }}>
                      <input
                        type="text"
                        name="table_search"
                        className="form-control pull-right"
                        placeholder="Search"
                        {...fields.filter}
                      />

                      <div className="input-group-btn">
                        <button type="submit" className="btn btn-default">
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-body table-responsive no-padding items-container">
                  <BootstrapTable
                    data={contactsData}
                    multiColumnSort={3}
                    striped
                    hover
                    options={{
                      onRowClick: (student) => browserHistory.push(`/users/${student.id}`),
                    }}
                    height="300px"
                  >
                    <TableHeaderColumn isKey hidden dataField="id" />

                    <TableHeaderColumn dataField="firstName" dataSort>
                      {formatMessage(messages.firstName)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="lastName" dataSort>
                      {formatMessage(messages.lastName)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="email" dataSort>
                      {formatMessage(messages.email)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="level" dataSort>
                      Level
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="phone" dataSort>
                      {formatMessage(messages.phone)}
                    </TableHeaderColumn>
                  </BootstrapTable>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 text-right">
            <button
              type="button"
              className="btn btn-xs btn-info"
              onClick={downloadContacts}
            >
              Stiahnuť vo formáte vCard
            </button>
          </div>
          <div className="clearfix" />
        </section>
        {user ? <UserProfileDialog user={users.get(user)} /> : null}
      </div>
    );
  }
}

ContactList = fields(ContactList, {
  path: 'contactList',
  fields: [
    'filter',
  ],
});

ContactList = injectIntl(ContactList);

export default connect(state => ({
  users: state.users.users,
  user: state.users.user,
  rolesList: state.users.rolesList,
  studentLevels: state.users.studentLevels,
}), actions)(ContactList);
