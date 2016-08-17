import React, { Component, PropTypes } from 'react';
import RichTextEditor from 'react-rte';

export default class TextEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.object,
  };

  render() {
    return (
      <RichTextEditor
        value={this.props.value}
        onChange={this.props.onChange}
      />
    );
  }
}
