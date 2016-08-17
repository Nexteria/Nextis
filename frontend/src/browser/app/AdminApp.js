import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';


export default class AdminApp extends Component {

  static propTypes = {
    children: PropTypes.object,
  };

  render() {
    const { children } = this.props;

    return (
      <div>{children}</div>
    );
  }

}
