import { Record, List, Map } from 'immutable';

import * as actions from './actions';
import Payment from './models/Payment';

const InitialState = Record({
  unassociatedPayments: null,
  showPaymentAssociationDialog: false,
  associateUserId: null,
  associationPaymentId: null,
  userPayments: null,
  usersPayments: null,
  paymentsSettings: null,
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

    case actions.LOAD_USERS_PAYMENTS_SUCCESS: {
      return state.set('usersPayments', new Map(Object.keys(action.payload).map(userId =>
        [parseInt(userId, 10), new List(action.payload[userId])]
      )));
    }

    case actions.DELETE_PAYMENTS_SUCCESS: {
      return state.set('userPayments',
        new List(action.payload.map(payment => new Payment(payment)))
      );
    }

    case actions.FETCH_GLOBAL_PAYMENTS_SETTINGS_SUCCESS: {
      return state.set('paymentsSettings', new Map({
        ...action.payload,
        schoolFeeApplicableMonths: new Map(action.payload.schoolFeeApplicableMonths.map(month => [month, true])),
      }));
    }

    default: {
      return state;
    }
  }
}
