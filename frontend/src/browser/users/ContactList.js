import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import diacritics from 'diacritics';
import { browserHistory } from 'react-router'

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
  fullName: {
    defaultMessage: 'Full name',
    id: 'contacts.list.fullName',
  },
  level: {
    defaultMessage: 'Level',
    id: 'contacts.list.level',
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
    openUserDetail: PropTypes.func.isRequired,
    studentLevels: PropTypes.object
  };

  render() {
    const { users, rolesList, studentLevels, fields, user, openUserDetail } = this.props;
    let students = [];
    if (users) {
      students = users.filter(user => user.roles.includes(rolesList.get('STUDENT').id))
        .valueSeq().sort((a, b) => {
          if (studentLevels.get(a.studentLevelId).name ===
            studentLevels.get(b.studentLevelId).name) {
            return ((a.lastName > b.lastName) ? 1 : -1);
          }
          return ((studentLevels.get(a.studentLevelId).name >
            studentLevels.get(b.studentLevelId).name) ? 1 : -1);
        });

      if (fields.filter.value) {
        students = students.filter(user =>
          diacritics.remove(`${user.firstName} ${user.lastName}`).toLowerCase()
            .indexOf(diacritics.remove(fields.filter.value.toLowerCase())) !== -1
        );
      }
    }

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
                  <table className="table table-hover contactListTable">
                    <thead>
                      <tr>
                        <th><FormattedMessage {...messages.fullName} /></th>
                        <th><FormattedMessage {...messages.level} /></th>
                        <th><FormattedMessage {...messages.email} /></th>
                        <th><FormattedMessage {...messages.phone} /></th>
                      </tr>
                      </thead>
                      <tbody>
                      {users ?
                        students.map(student =>
                          <tr key={student.id} onClick={() => browserHistory.push(`/users/${student.id}`)}>
                            <td>{student.firstName} {student.lastName}</td>
                            <td>{studentLevels.get(student.studentLevelId).name}</td>
                            <td>{student.email}</td>
                            <td>{student.phone}</td>
                          </tr>
                        )
                        :
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}>
                            <FormattedMessage {...messages.no_contacts} /></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        {user ? <UserProfileDialog user={users.get(user)} /> : ""}
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

export default connect(state => ({
  users: state.users.users,
  user: state.users.user,
  studentLevels: state.users.studentLevels,
  rolesList: state.users.rolesList,
}), actions)(ContactList);
