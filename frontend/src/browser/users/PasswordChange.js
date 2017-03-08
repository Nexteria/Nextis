import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import validator from 'validator';


import * as actions from '../../common/users/actions';

const messages = defineMessages({
  passwordsDoNotMatch: {
    defaultMessage: 'New password and password confirmation must match!',
    id: 'user.edit.passwordsDoNotMatch',
  },
  requiredField: {
    defaultMessage: 'This field is required!',
    id: 'user.edit.requiredField',
  },
  oldPassword: {
    defaultMessage: 'Old password',
    id: 'user.edit.oldPassword',
  },
  newPassword: {
    defaultMessage: 'New password',
    id: 'user.edit.newPassword',
  },
  newPasswordConfirmation: {
    defaultMessage: 'New password confirmation',
    id: 'user.edit.newPasswordConfirmation',
  },
  changePassword: {
    defaultMessage: 'Change password',
    id: 'user.edit.changePassword',
  },
});

const validate = (values, props) => {
  const { formatMessage } = props.intl;

  const errors = {};
  if (!values.newPassword) {
    errors.newPassword = formatMessage(messages.requiredField);
  } else if (values.newPasswordConfirmation && values.newPasswordConfirmation !== values.newPassword) {
    errors.newPassword = formatMessage(messages.passwordsDoNotMatch);
    errors.newPasswordConfirmation = formatMessage(messages.passwordsDoNotMatch);
  }

  if (!values.newPasswordConfirmation) {
    errors.newPasswordConfirmation = formatMessage(messages.requiredField);
  }

  if (!values.oldPassword) {
    errors.oldPassword = formatMessage(messages.requiredField);
  }

  return errors;
};

export class PasswordChange extends Component {

  static propTypes = {    
  }

  renderInput(data) {
    const { input, label, type, meta: { touched, error, pristine } } = data;

    return (
      <div className={`form-group ${touched && error && (!pristine || !input.value) ? 'has-error' : ''}`}>
        <label className="col-sm-2 control-label">
          {label}
        </label>
        <div className="col-sm-10">
          <input
            {...input}
            readOnly={data.readOnly}
            placeholder={label} type={type}
            className="form-control"
          />
          {pristine && input.value ?
            ''
            :
            <div className="has-error">
              {touched && error && <label>{error}</label>}
            </div>
          }
        </div>
      </div>
    );
  }

  render() {
    const { pristine, submitting, title } = this.props;
    const { touch, handleSubmit, changePassword } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit((data) => changePassword(data))}>
          <Field
            name="oldPassword"
            type="password"
            component={this.renderInput}
            label={`${formatMessage(messages.oldPassword)}*`}
          />

          <Field
            name="newPassword"
            type="password"
            component={this.renderInput}
            label={`${formatMessage(messages.newPassword)}*`}
          />

          <Field
            name="newPasswordConfirmation"
            type="password"
            component={this.renderInput}
            label={`${formatMessage(messages.newPasswordConfirmation)}*`}
          />
          <button type="submit" className="btn btn-success pull-right">
            <FormattedMessage {...messages.changePassword} />
          </button>
          <span className="clearfix"></span>
        </form>
      </div>
    );
  }
}

PasswordChange = reduxForm({
  form: 'passwordChange',
  validate,
})(PasswordChange);

PasswordChange = injectIntl(PasswordChange);
const selector = formValueSelector('passwordChange');

export default connect(() => {}, actions)(PasswordChange);
