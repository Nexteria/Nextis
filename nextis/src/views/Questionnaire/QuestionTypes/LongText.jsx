import React from 'react';

import CustomInput from 'components/CustomInput/CustomInput';

export default class LongText extends React.Component {
  render() {
    const {
      question,
      onChange,
      answer,
    } = this.props;

    return (
      <div className="col-md-12">
        <CustomInput
          labelText=""
          id={question.id}
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: 'text',
            value: answer || '',
            onChange: e => onChange(e.target.value),
            multiline: true,
            rows: 6,
          }}
        />
      </div>
    );
  }
}
