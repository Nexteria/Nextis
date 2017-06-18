import React from 'react';
import Datetime from 'react-datetime';

export default function renderDate(data) {
  const { input, label, locale, meta: { touched, error } } = data;

  return (
    <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
      <label className="col-sm-12 control-label">
        {label}
      </label>

      <div className="col-sm-12">
        <Datetime
          inputProps={{ id: input.name }}
          locale={locale}
          value={input.value}
          onBlur={input.onBlur}
          onChange={(date) => input.onChange(date)}
        />
        <div className="has-error">
          {touched && error && <label>{error}</label>}
        </div>
      </div>
    </div>
  );
}
