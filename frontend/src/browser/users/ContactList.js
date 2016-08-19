import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';

const messages = defineMessages({
  title: {
    defaultMessage: 'Contact list',
    id: 'contacts.list.title'
  },
  no_contacts: {
    defaultMessage: 'No contacts here',
    id: 'contacts.list.no_contacts'
  },
});

class ContactList extends Component {

  static propTypes = {
    users: PropTypes.object,
    rolesList: PropTypes.object,
  };

  render() {
    const { users, rolesList } = this.props;

    return (
      <div>
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
          <ol className="breadcrumb">
            <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
            <li className="active">Dashboard</li>
          </ol>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <div className="box-header">
                  <h3 className="box-title">Kontakty - študenti</h3>

                  <div className="box-tools">
                    <div className="input-group input-group-sm" style={{ width: '150px' }}>
                      <input
                        type="text"
                        name="table_search"
                        className="form-control pull-right"
                        placeholder="Search"
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
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <th>Meno a priezvisko</th>
                        <th>Level</th>
                        <th>Email</th>
                        <th>Telefón</th>
                      </tr>
                      {users ?
                        users.filter(user => user.roles.includes(rolesList.get('STUDENT').id)).valueSeq().map(student =>
                          <tr key={student.id}>
                            <td>{student.firstName} {student.lastName}</td>
                            <td>{student.level}</td>
                            <td>{student.email}</td>
                            <td>{student.phone}</td>
                          </tr>
                        )
                        :
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}><FormattedMessage {...messages.no_contacts} /></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

}

export default connect(state => ({
  users: state.users.users,
  rolesList: state.users.rolesList,
}))(ContactList);
