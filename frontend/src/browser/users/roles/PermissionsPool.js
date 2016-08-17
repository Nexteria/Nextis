import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { fields } from '../../../common/lib/redux-fields/index';

const messages = defineMessages({
  permissionsPool: {
    defaultMessage: 'Permissions pool',
    id: 'role.edit.permissionsPool',
  },
});

export class PermissionsPool extends Component {

  static propTypes = {
    permissions: PropTypes.object.isRequired,
    addPermissionToRole: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { fields } = this.props;

    fields.filter.onChange({ target: { value: '' } });
  }

  render() {
    const { fields } = this.props;
    let { permissions } = this.props;
    const { addPermissionToRole } = this.props;

    const filter = fields.filter.value;
    if (filter) {
      permissions = permissions.valueSeq().filter(permission =>
        `${permission.display_name}`.indexOf(filter) !== -1
      );
    }

    return (
      <div className="col-md-6" id="items-pool-container">
        <label><FormattedMessage {...messages.permissionsPool} /></label>
        <div className="input-group input-group-sm searchbox pull-right">
          <input type="text" name="table_search" {...fields.filter} className="form-control pull-right" placeholder="Search" />

          <div className="input-group-btn">
            <button type="submit" className="btn btn-default"><i className="fa fa-search"></i></button>
          </div>
        </div>
        <ul id="items-pool" className="nav nav-pills nav-stacked">
          {permissions.valueSeq().map(permission =>
            <li key={permission.id} className="group">
              <a onClick={() => addPermissionToRole(permission)}><i className="fa fa-gavel"></i>
                {permission.display_name}
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default fields(PermissionsPool, {
  path: 'permissionsPool',
  fields: [
    'filter',
  ],
});
