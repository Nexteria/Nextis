import Component from 'react-pure-render/component';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';

export class AdminApp extends Component {

  static propTypes = {
    children: PropTypes.object,
    hasPermission: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { hasPermission } = this.props;

    if (!hasPermission('view_admin_section')) {
      browserHistory.replace('/');
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div>{children}</div>
    );
  }

}

export default connect(state => ({
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}))(AdminApp);
