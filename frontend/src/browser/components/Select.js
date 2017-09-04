import React from 'react';

export default function renderSelect(data) {
  const { input, label, children, meta: { touched, error } } = data;

  return (
    <div className={`form-group ${touched && error ? 'has-error' : ''}`} >
      <label className="col-sm-12 control-label" htmlFor={input.name}>
        {label}
      </label>
      <div className="col-sm-12">
        <select
          {...input}
          className="form-control"
          readOnly={data.readOnly}
        >
        {children}
        </select>
        <div className="has-error">
          {touched && error && <label>{error}</label>}
        </div>
      </div>
      <div className="clearfix"></div>
    </div>
  );
}
