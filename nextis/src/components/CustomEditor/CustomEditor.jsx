import React from 'react';
import RichTextEditor from 'react-rte';

export const stateFromHTML = (html) => RichTextEditor.createValueFromString(html, 'html');

const toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'}
  ],
  BLOCK_TYPE_DROPDOWN: [
    {label: 'Normal', style: 'unstyled'},
    {label: 'Heading Large', style: 'header-one'},
    {label: 'Heading Medium', style: 'header-two'},
    {label: 'Heading Small', style: 'header-three'}
  ],
  BLOCK_TYPE_BUTTONS: [
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'}
  ]
};

export default class CustomEditor extends React.Component {
  render() {
    return (
      <RichTextEditor
        value={this.props.editorState}
        onChange={this.props.onChange}
        toolbarConfig={{
          ...toolbarConfig,
          display: this.props.display || ['INLINE_STYLE_BUTTONS']
        }}
        toolbarClassName={this.props.toolbarClassName || ""}
        editorClassName={this.props.editorClassName || ""}
        className={this.props.className || ""}
      />
    );
  }
}