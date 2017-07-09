import React from 'react';
import RichTextEditor from 'react-rte';

export default function renderEditor(data) {
  const { input, label, contentCol, labelCol, meta: { error } } = data;

  const contentColumn = contentCol || 12;
  const labelColumn = labelCol || 12;

  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      <label className={`col-sm-${labelColumn} control-label`}>
        {label}
      </label>
      <div className={`col-sm-${contentColumn}`}>
        <RichTextEditor
          value={input.value}
          onChange={input.onChange}
        />
        <div className="has-error">
          {error && <label>{error}</label>}
        </div>
      </div>
      <div className="clearfix"></div>
    </div>
  );
}
