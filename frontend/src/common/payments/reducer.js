import { Record, List } from 'immutable';

import * as actions from './actions';
import Payment from './models/Payment';

const InitialState = Record({
  unassociatedPayments: null,
  showPaymentAssociationDialog: false,
  associateUserId: null,
  associationPaymentId: null,
  userPayments: null,
}, 'payments');

export default function nxLocationsReducer(state = new InitialState, action) {
  switch (action.type) {

    case actions.LOAD_UNASSOCIATED_PAYMENTS_SUCCESS: {
      return state.set('unassociatedPayments',
        new List(action.payload.map(payment => new Payment(payment)))
      );
    }

    case actions.OPEN_PAYMENT_ASSOCIATION_DIALOG: {
      return state.set('showPaymentAssociationDialog', true)
                  .set('associationPaymentId', action.payload);
    }

    case actions.CLOSE_PAYMENT_ASSOCIATION_DIALOG: {
      return state.set('showPaymentAssociationDialog', false)
                  .set('associateUserId', null)
                  .set('associationPaymentId', null);
    }

    case actions.CHANGE_ASSOCIATION_USER_ID: {
      return state.set('associateUserId', action.payload);
    }

    case actions.ASSOCIATE_PAYMENT_SUCCESS: {
      const paymentIndex = state.unassociatedPayments.findIndex(p => p.id === action.payload);
      return state.update('unassociatedPayments', payments => payments.delete(paymentIndex))
                  .set('associateUserId', null)
                  .set('associationPaymentId', null)
                  .set('showPaymentAssociationDialog', false);
    }

    case actions.LOAD_USER_PAYMENTS_SUCCESS: {
      return state.set('userPayments',
        new List(action.payload.map(payment => new Payment(payment)))
      );
    }

    default: {
      return state;
    }
  }
}
