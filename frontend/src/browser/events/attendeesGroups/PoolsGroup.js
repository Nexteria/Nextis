import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';


export default class PoolsGroup extends Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
    addGroup: PropTypes.func.isRequired,
  };

  render() {
    const { group } = this.props;
    const { addGroup } = this.props;

    return (
      <li className="group">
        <a onClick={() => addGroup(group)}><i className="fa fa-users"></i>
          {group.name}
          <span className="label pull-right">{group.users.count()}</span>
        </a>
      </li>
    );
  }
}
