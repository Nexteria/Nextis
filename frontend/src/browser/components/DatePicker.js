import React from 'react';
import Datetime from 'react-datetime';

export default function renderDate(data) {
  const { input, label, locale, onlyDate, contentCol, labelCol, meta: { touched, error } } = data;

  const contentColumn = contentCol || 12;
  const labelColumn = labelCol || 12;

  return (
    <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
      <label className={`col-sm-${labelColumn} control-label`}>
        {label}
      </label>

      <div className={`col-sm-${contentColumn}`}>
        <Datetime
          inputProps={{ id: input.name }}
          locale={locale}
          value={input.value}
          onBlur={input.onBlur}
          onChange={(date) => input.onChange(date)}
          timeFormat={!onlyDate}
        />
        <div className="has-error">
          {touched && error && <label>{error}</label>}
        </div>
      </div>
    </div>
  );
}
