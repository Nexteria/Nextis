import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import Typeahead from 'react-bootstrap-typeahead';


import * as paymentsActions from '../../common/payments/actions';
import * as usersActions from '../../common/users/actions';

const messages = defineMessages({
  closeButton: {
    defaultMessage: 'Cancel',
    id: 'payments.associate.closeButton',
  },
  associateButton: {
    defaultMessage: 'Associate',
    id: 'payments.associate.associateButton',
  },
  associatePayment: {
    defaultMessage: 'Associate payment',
    id: 'payments.associatePayment',
  },
  chooseUser: {
    defaultMessage: 'Choose user',
    id: 'payments.associatePayment.chooseUser',
  },
});

export class UnassociatedPaymentsDialog extends Component {

  static propTypes = {
    users: PropTypes.object,
    closePaymentAssociationDialog: PropTypes.func.isRequired,
    showPaymentAssociationDialog: PropTypes.bool.isRequired,
    associatePayment: PropTypes.func.isRequired,
    changeAssociationUserId: PropTypes.func.isRequired,
    associateUserId: PropTypes.number,
    associationPaymentId: PropTypes.number,
    loadUsers: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.loadUsers();
  }

  render() {
    const { users,
      closePaymentAssociationDialog,
      showPaymentAssociationDialog,
      associatePayment,
      changeAssociationUserId,
      associateUserId,
      associationPaymentId,
    } = this.props;

    return (
      <Modal
        show={showPaymentAssociationDialog}
        bsSize="small"
        dialogClassName="event-details-dialog"
        onHide={closePaymentAssociationDialog}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.associatePayment} /></Title>
        </Header>

        <Body>
          <div className="form-group">
            <label htmlFor="student-name"><FormattedMessage {...messages.chooseUser} /></label>
            <Typeahead
              labelKey="name"
              onChange={(users) => changeAssociationUserId(users[0].id)}
              options={users.map(user => ({ id: user.id, name: `${user.firstName} ${user.lastName}` })).toArray()}
            />
          </div>
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-success"
              onClick={() => associatePayment(associateUserId, associationPaymentId)}
            >
              <FormattedMessage {...messages.associatePayment} />
            </button>
            <button
              className="btn btn-danger"
              onClick={closePaymentAssociationDialog}
            >
              <FormattedMessage {...messages.closeButton} />
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

export default connect(state => ({
  users: state.users.users,
  showPaymentAssociationDialog: state.payments.showPaymentAssociationDialog,
  associationPaymentId: state.payments.associationPaymentId,
  associateUserId: state.payments.associateUserId,
}), { ...paymentsActions, ...usersActions })(UnassociatedPaymentsDialog);
