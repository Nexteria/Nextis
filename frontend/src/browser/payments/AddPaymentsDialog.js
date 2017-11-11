import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import Datetime from 'react-datetime';
import isAfter from 'date-fns/is_after';


import GroupMembers from '../events/attendeesGroups/GroupMembers';
import UsersPool from '../events/attendeesGroups/UsersPool';
import * as actions from '../../common/users/actions';
import * as paymentAction from '../../common/payments/actions';
import './AddPaymentsDialog.scss';

const messages = defineMessages({
  usersPool: {
    defaultMessage: 'Users pool',
    id: 'event.edit.userGroup.usersPool',
  },
  addPayment: {
    defaultMessage: 'Add payment',
    id: 'user.manage.payments.addPayment',
  },
  validFrom: {
    defaultMessage: 'Valid from',
    id: 'user.manage.payments.validFrom',
  },
  deadlineAt: {
    defaultMessage: 'Deadline at',
    id: 'user.manage.payments.deadlineAt',
  },
  amount: {
    defaultMessage: 'Amount',
    id: 'user.manage.payments.amount',
  },
  variableSymbol: {
    defaultMessage: 'Variable symbol',
    id: 'user.manage.payments.variableSymbol',
  },
  transactionType: {
    defaultMessage: 'Transaction type',
    id: 'user.manage.payments.transactionType',
  },
  description: {
    defaultMessage: 'Description',
    id: 'user.manage.payments.description',
  },
  title: {
    defaultMessage: 'Add new payments',
    id: 'user.manage.payments.newPaymentTitle',
  },
  requiredField: {
    defaultMessage: 'This field is required',
    id: 'user.payments.addNew.requiredField',
  },
  mustBeValidNumber: {
    defaultMessage: 'This field must be valid number',
    id: 'user.payments.addNew.mustBeValidNumber',
  },
  validFromDateMustBeBeforeDeadlineDate: {
    defaultMessage: 'Valid from date must be before deadline date!',
    id: 'user.payments.addNew.validFromDateMustBeBeforeDeadlineDate',
  },
  selectAtLeastOneUser: {
    defaultMessage: 'Select at least one user!',
    id: 'user.payments.addNew.selectAtLeastOneUser',
  },
});

const validate = (values, props) => {
  const { formatMessage } = props.intl;

  const errors = {};
  if (!values.amount) {
    errors.amount = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.amount}`)) {
    errors.amount = formatMessage(messages.mustBeValidNumber);
  } else if (values.amount < 0) {
    errors.amount = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.description) {
    errors.description = formatMessage(messages.requiredField);
  }

  if (!values.variableSymbol) {
    errors.variableSymbol = formatMessage(messages.requiredField);
  } else if (!validator.isDecimal(`${values.variableSymbol}`)) {
    errors.variableSymbol = formatMessage(messages.mustBeValidNumber);
  }

  if (!values.validFrom) {
    errors.validFrom = formatMessage(messages.requiredField);
  } else if (values.deadlineAt && isAfter(values.validFrom, values.deadlineAt)) {
    errors.validFrom = formatMessage(messages.validFromDateMustBeBeforeDeadlineDate);
  }

  if (!values.deadlineAt) {
    errors.deadlineAt = formatMessage(messages.requiredField);
  }

  if (!props.userGroup || props.userGroup.users.size < 1) {
    errors._error = formatMessage(messages.selectAtLeastOneUser);
  }

  if (!values.transactionType || (values.transactionType !== 'kredit' && values.transactionType !== 'debet')) {
    errors.transactionType = formatMessage(messages.requiredField);
  }

  

  return errors;
};

export class AddPaymentsDialog extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    groups: PropTypes.object.isRequired,
    userGroup: PropTypes.object,
    addUserToGroup: PropTypes.func.isRequired,
    addGroupToGroup: PropTypes.func.isRequired,
    updateUserGroup: PropTypes.func.isRequired,
    removeUserFromGroup: PropTypes.func.isRequired,
    changeUserGroupName: PropTypes.func.isRequired,
    addUserGroup: PropTypes.func.isRequired,
    closeUserGroupDialog: PropTypes.func.isRequired,
    loadUsers: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const { addUserGroup, loadUsers } = this.props;
    
    loadUsers();
    addUserGroup();
  }

  renderDate(data) {
    const { input, label, locale, meta: { touched, error } } = data;

    return (
      <div className={`form-group col-md-2 ${touched && error ? 'has-error' : ''}`}>
        <label>
          {label}
        </label>

        <div className="input-group">
          <span className="input-group-addon"><i className="fa fa-calendar"></i></span>
          <Datetime
            locale={locale}
            inputProps={{ id: input.name }}
            timeFormat={false}
            closeOnSelect
            value={input.value}
            onBlur={input.onBlur}
            onChange={(moment) => input.onChange(moment)}
          />
        </div>
        <div className="has-error">
          {touched && error && <label>{error}</label>}
        </div>
      </div>
    );
  }

  renderAmount(data) {
    const { input, label, type, meta: { asyncValidating, touched, error, pristine } } = data;

    return (
      <div className={`form-group col-md-2 ${touched && error && (!pristine || !input.value) ? 'has-error' : ''}`}>
        <label>
          {label}
        </label>
        <div className={`input-group ${asyncValidating ? 'async-validating' : ''}`}>
          <span className="input-group-addon"><i className="fa fa-euro"></i></span>
          <input
            {...input}
            readOnly={data.readOnly}
            placeholder={label} type={type}
            className="form-control"
            id={input.name}
          />
        </div>
        {pristine && input.value ?
          ''
          :
          <div className="has-error">
            {touched && error && <label>{error}</label>}
          </div>
        }
      </div>
    );
  }

  renderTransactionType(data) {
    const { input, label, children, meta: { touched, error } } = data;

    return (
      <div className={`form-group col-md-2 ${touched && error ? 'has-error' : ''}`}>
        <label>
          {label}
        </label>
        <div>
          <select
            {...input}
            className="form-control"
          >
            <option key={0} value="">Choose option</option>
            <option key={1} value="kredit">Kredit</option>
            <option key={2} value="debet">Debet</option>
          </select>
          <div className="has-error">
            {touched && error && <label>{error}</label>}
          </div>
        </div>
      </div>
    );
  }

  renderInput(data) {
    const { input, label, type, meta: { asyncValidating, touched, error, pristine } } = data;

    return (
      <div className={`form-group col-md-2 ${touched && error && (!pristine || !input.value) ? 'has-error' : ''}`}>
        <label>
          {label}
        </label>
        <div className={`${asyncValidating ? 'async-validating' : ''}`}>
          <input
            {...input}
            readOnly={data.readOnly}
            placeholder={label} type={type}
            className="form-control"
            id={input.name}
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
    const { groups, users, error, userGroup } = this.props;
    const {
      addUserToGroup,
      addGroupToGroup,
      updateUserGroup,
      handleSubmit,
      removeUserFromGroup,
      changeUserGroupName,
      addPayments,
      locale,
    } = this.props;

    const { formatMessage } = this.props.intl;

    if (!userGroup || !users) {
      return <div></div>;
    }

    const groupMembers = userGroup.users.valueSeq().map(
      user => users.get(user)
    );

    return (
      <Modal
        show
        bsStyle="lg"
        dialogClassName="add-new-payments-modal"
        onHide={() => browserHistory.goBack()}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.title} /></Title>
        </Header>

        <Body>
          <div className="col-md-12">
            <Field
              name="amount"
              type="text"
              component={this.renderAmount}
              label={`${formatMessage(messages.amount)}*`}
            />

            <Field
              name="transactionType"
              component={this.renderTransactionType}
              label={`${formatMessage(messages.transactionType)}*`}
            />

            <Field
              name="variableSymbol"
              type="number"
              component={this.renderInput}
              label={`${formatMessage(messages.variableSymbol)}*`}
            />

            <Field
              name="description"
              type="text"
              component={this.renderInput}
              label={`${formatMessage(messages.description)}*`}
            />

            <Field
              name="deadlineAt"
              component={this.renderDate}
              label={`${formatMessage(messages.deadlineAt)}*`}
              locale={locale}
            />

            <Field
              name="validFrom"
              component={this.renderDate}
              label={`${formatMessage(messages.validFrom)}*`}
              locale={locale}
            />
          </div>

          <GroupMembers
            users={groupMembers}
            removeUser={removeUserFromGroup}
          />
          <UsersPool
            groups={groups}
            users={users}
            addUser={addUserToGroup}
            addGroup={addGroupToGroup}
          />
          <div className="clearfix"></div>
        </Body>

        <Footer>
          <div className="col-md-12">
            <div className=" form-group has-error">
              <label>{error}</label>
            </div>
            <button
              className="btn btn-success"
              onClick={handleSubmit}
            >
              <FormattedMessage {...messages.addPayment} />
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

AddPaymentsDialog = reduxForm({
  form: 'addPaymentsDialog',
  validate,
  onSubmit: (values, dispatch, props) => props.addPayments(values, props.userGroup.users).then(() => props.reset()),
  shouldValidate: () => true,
})(AddPaymentsDialog);

AddPaymentsDialog = injectIntl(AddPaymentsDialog);

export default connect((state) => ({
  users: state.users.users,
  locale: state.intl.currentLocale,
  groups: state.users.groups,
  userGroup: state.users.editingUserGroup,
}), { ...actions, ...paymentAction })(AddPaymentsDialog);
