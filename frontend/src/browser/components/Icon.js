import React, { Component, PropTypes } from 'react';

export default class Icon extends Component {
  static propTypes = {
    type: PropTypes.string,
    onClick: PropTypes.func,
  };

  render() {
    const { type, onClick } = this.props;
    return (
      <span
        onClick={onClick || null}
        className={`fa fa-${type}`}
        style={{
          color: type === 'close' ? 'red' : 'green',
          cursor: onClick ? 'pointer' : '',
        }}
      ></span>
    );
  }
}
