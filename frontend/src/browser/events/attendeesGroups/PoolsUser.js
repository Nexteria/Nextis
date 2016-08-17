import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';


export default class PoolsUser extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    addUser: PropTypes.func.isRequired,
  };

  render() {
    const { user } = this.props;
    const { addUser } = this.props;

    return (
      <li className="group">
        <a onClick={() => addUser(user.id)}><i className="fa fa-user"></i>
        {`${user.firstName} ${user.lastName} (${user.username})`}
        </a>
      </li>
    );
  }
}
