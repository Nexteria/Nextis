import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { fields } from '../../../common/lib/redux-fields/index';
import * as actions from '../../../common/users/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Roles',
    id: 'roles.manage.title'
  },
  tableTitle: {
    defaultMessage: 'Roles - managment',
    id: 'roles.manage.table.title'
  },
  noRoles: {
    defaultMessage: 'No roles here',
    id: 'roles.manage.noRoles'
  },
  roleName: {
    defaultMessage: 'Role name',
    id: 'roles.manage.roleName'
  },
  actions: {
    defaultMessage: 'Actions',
    id: 'roles.manage.actions'
  },
});

class RolesPage extends Component {

  static propTypes = {
    rolesList: PropTypes.object,
    fields: PropTypes.object.isRequired,
    removeRole: PropTypes.func.isRequired,
    loadPermissionsList: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    intl: PropTypes.func.isRequired,
  };

  getRoleActions(role) {
    const { removeRole } = this.props;

    return (
      <span className="action-buttons">
        <i
          className="fa fa-trash-o trash-group"
          onClick={() => removeRole(role)}
        ></i>
        <i
          className="fa fa-pencil"
          onClick={() => this.editRole(role.id)}
        ></i>
      </span>
    );
  }

  editRole(roleId) {
    browserHistory.push(`/admin/roles/${roleId}`);
  }

  render() {
    const { rolesList, fields } = this.props;
    const { removeRole, hasPermission } = this.props;
    const { formatMessage } = this.props.intl;

    if (!rolesList) {
      return <div></div>;
    }

    let filteredRoles = rolesList.valueSeq().map(role => role);
    if (fields.filter.value) {
      filteredRoles = rolesList.valueSeq().filter(role =>
        diacritics.remove(`${role.display_name}`).toLowerCase()
          .indexOf(diacritics.remove(fields.filter.value).toLowerCase()) !== -1
      );
    }

    const rolesData = filteredRoles.map(role => ({
      id: role.id,
      roleName: role.display_name,
      actions: this.getRoleActions(role),
    })).toArray();

    return (
      <div className="event-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
            {hasPermission('create_roles') ?
              <i
                className="fa fa-plus text-green"
                style={{ cursor: 'pointer', marginLeft: '2em' }}
                onClick={() => browserHistory.push('/admin/roles/create')}
              ></i>
             : ''
            }
          </h1>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <div className="box-header">
                  <h3 className="box-title"><FormattedMessage {...messages.tableTitle} /></h3>
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
                    data={rolesData}
                    striped
                    hover
                    height="300px"
                    containerStyle={{ height: '320px' }}
                  >
                    <TableHeaderColumn isKey hidden dataField="id" />

                    <TableHeaderColumn dataField="roleName" dataSort>
                      {formatMessage(messages.roleName)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="actions" dataFormat={x => x}>
                      {formatMessage(messages.actions)}
                    </TableHeaderColumn>
                  </BootstrapTable>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

RolesPage = fields(RolesPage, {
  path: 'roles',
  fields: [
    'filter',
  ],
});

RolesPage = injectIntl(RolesPage);

export default connect(state => ({
  rolesList: state.users.rolesList,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(RolesPage);
