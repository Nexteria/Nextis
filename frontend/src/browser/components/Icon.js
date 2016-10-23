import React, { Component, PropTypes } from 'react';

export default class Icon extends Component {
  static propTypes = {
    type: PropTypes.string,
  };

  render() {
    const { type } = this.props;
    return (
      <span
        className={`fa fa-${type}`}
        style={{ color: type == 'close' ? 'red' : 'green' }}
      ></span>
    );
  }
}
