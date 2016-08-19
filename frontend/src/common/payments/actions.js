export const LOAD_UNASSOCIATED_PAYMENTS = 'LOAD_UNASSOCIATED_PAYMENTS';
export const LOAD_UNASSOCIATED_PAYMENTS_SUCCESS = 'LOAD_UNASSOCIATED_PAYMENTS_SUCCESS';

export const ASSOCIATE_PAYMENT = 'ASSOCIATE_PAYMENT';
export const ASSOCIATE_PAYMENT_SUCCESS = 'ASSOCIATE_PAYMENT_SUCCESS';

export const LOAD_USER_PAYMENTS = 'LOAD_USER_PAYMENTS';
export const LOAD_USER_PAYMENTS_SUCCESS = 'LOAD_USER_PAYMENTS_SUCCESS';

export const OPEN_PAYMENT_ASSOCIATION_DIALOG = 'OPEN_PAYMENT_ASSOCIATION_DIALOG';
export const CLOSE_PAYMENT_ASSOCIATION_DIALOG = 'CLOSE_PAYMENT_ASSOCIATION_DIALOG';
export const CHANGE_ASSOCIATION_USER_ID = 'CHANGE_ASSOCIATION_USER_ID';

export function loadUnassociatedPayments() {
  return ({ fetch }) => ({
    type: LOAD_UNASSOCIATED_PAYMENTS,
    payload: {
      promise: fetch('/payments/unassociated', {
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function openPaymentAssociationDialog(paymentId) {
  return {
    type: OPEN_PAYMENT_ASSOCIATION_DIALOG,
    payload: paymentId,
  };
}

export function closePaymentAssociationDialog() {
  return {
    type: CLOSE_PAYMENT_ASSOCIATION_DIALOG,
  };
}

export function changeAssociationUserId(userId) {
  return {
    type: CHANGE_ASSOCIATION_USER_ID,
    payload: userId,
  };
}

export function associatePayment(userId, paymentId) {
  return ({ fetch }) => ({
    type: ASSOCIATE_PAYMENT,
    payload: {
      promise: fetch(`/payments/${paymentId}`, {
        credentials: 'same-origin',
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
        }),
      }).then(() => paymentId),
    },
  });
}

export function loadUsersPayments(userId) {
  return ({ fetch }) => ({
    type: LOAD_USER_PAYMENTS,
    payload: {
      promise: fetch(`/users/${userId}/payments`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json()),
    },
  });
}
