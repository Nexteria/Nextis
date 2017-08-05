import React from 'react';

export default function renderTextArea(data) {
  const { input, label, type, meta: { asyncValidating, touched, error } } = data;

  return (
    <div
      className={`form-group ${touched && error ? 'has-error' : ''}`}
    >
      <label className="col-sm-12 control-label" htmlFor={input.name}>
        {label}
      </label>
      <div className={`col-sm-12 ${asyncValidating ? 'async-validating' : ''}`}>
        <textarea
          {...input}
          readOnly={data.readOnly}
          placeholder={label}
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
