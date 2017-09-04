import React from 'react';

export default function renderInput(data) {
  const { input, label, icon, type, contentCol, labelCol, meta: { asyncValidating, touched, error } } = data;

  const contentColumn = contentCol || 12;
  const labelColumn = labelCol || 12;

  return (
    <div
      className={`form-group ${touched && error ? 'has-error' : ''}`}
    >
      <label className={`col-sm-${labelColumn} control-label`} htmlFor={input.name}>
        {label}
      </label>
      <div className={`col-sm-${contentColumn} ${icon ? 'input-group' : ''} ${asyncValidating ? 'async-validating' : ''}`}>
        {icon && <span className="input-group-addon">{icon}</span>}
        <input
          {...input}
          readOnly={data.readOnly}
          placeholder={label}
          type={type}
          className={type !== 'checkbox' ? 'form-control' : 'checkbox'}
          id={input.name}
        />
        <div className="has-error">
          {touched && error && <label>{error}</label>}
        </div>
      </div>
      <div className="clearfix"></div>
    </div>
  );
}
