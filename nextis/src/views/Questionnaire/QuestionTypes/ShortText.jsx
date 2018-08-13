import React from 'react';

import CustomInput from 'components/CustomInput/CustomInput';

export default class ShortText extends React.Component {
  render() {
    const {
      question,
      onChange,
      answer
    } = this.props;

    return (
      <div className="col-md-12">
        <CustomInput
          id={question.id}
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: 'text',
            value: answer || '',
            onChange: e => onChange(e.target.value)
          }}
        />
      </div>
    );
  }
}
