import React, { Component, PropTypes } from 'react';
import RichTextEditor from 'react-rte';

export default class TextEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  state = {
    value: RichTextEditor.createEmptyValue()
  }

  componentWillMount() {
    const { value } = this.props;

    if (value) {
      this.state = RichTextEditor.createValueFromString(value, 'html');
    }
  }

  onChange = (value) => {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(
        value.toString('html')
      );
    }
  }

  render() {
    return (
      <RichTextEditor
        value={this.state.value}
        onChange={this.onChange}
      />
    );
  }
}
