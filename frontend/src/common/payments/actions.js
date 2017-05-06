export const UPLOAD_PAYMENTS_IMPORT = 'UPLOAD_PAYMENTS_IMPORT';
export const UPLOAD_PAYMENTS_IMPORT_START = 'UPLOAD_PAYMENTS_IMPORT_START';
export const UPLOAD_PAYMENTS_IMPORT_SUCCESS = 'UPLOAD_PAYMENTS_IMPORT_SUCCESS';
export const UPLOAD_PAYMENTS_IMPORT_ERROR = 'UPLOAD_PAYMENTS_IMPORT_ERROR';

export const LOAD_USER_PAYMENTS_SETTINGS = 'LOAD_USER_PAYMENTS_SETTINGS';
export const LOAD_USER_PAYMENTS_SETTINGS_START = 'LOAD_USER_PAYMENTS_SETTINGS_START';
export const LOAD_USER_PAYMENTS_SETTINGS_SUCCESS = 'LOAD_USER_PAYMENTS_SETTINGS_SUCCESS';
export const LOAD_USER_PAYMENTS_SETTINGS_ERROR = 'LOAD_USER_PAYMENTS_SETTINGS_ERROR';

export const DELETE_PAYMENTS = 'DELETE_PAYMENTS';
export const DELETE_PAYMENTS_START = 'DELETE_PAYMENTS_START';
export const DELETE_PAYMENTS_SUCCESS = 'DELETE_PAYMENTS_SUCCESS';
export const DELETE_PAYMENTS_ERROR = 'DELETE_PAYMENTS_ERROR';

export const UPDATE_USERS_PAYMENTS_SETTINGS = 'UPDATE_USERS_PAYMENTS_SETTINGS';
export const UPDATE_USERS_PAYMENTS_SETTINGS_START = 'UPDATE_USERS_PAYMENTS_SETTINGS_START';
export const UPDATE_USERS_PAYMENTS_SETTINGS_SUCCESS = 'UPDATE_USERS_PAYMENTS_SETTINGS_SUCCESS';
export const UPDATE_USERS_PAYMENTS_SETTINGS_ERROR = 'UPDATE_USERS_PAYMENTS_SETTINGS_ERROR';

export const FETCH_GLOBAL_PAYMENTS_SETTINGS = 'FETCH_GLOBAL_PAYMENTS_SETTINGS';
export const FETCH_GLOBAL_PAYMENTS_SETTINGS_START = 'FETCH_GLOBAL_PAYMENTS_SETTINGS_START';
export const FETCH_GLOBAL_PAYMENTS_SETTINGS_SUCCESS = 'FETCH_GLOBAL_PAYMENTS_SETTINGS_SUCCESS';
export const FETCH_GLOBAL_PAYMENTS_SETTINGS_ERROR = 'FETCH_GLOBAL_PAYMENTS_SETTINGS_ERROR';

export const ADD_PAYMENTS = 'ADD_PAYMENTS';
export const ADD_PAYMENTS_START = 'ADD_PAYMENTS_START';
export const ADD_PAYMENTS_SUCCESS = 'ADD_PAYMENTS_SUCCESS';
export const ADD_PAYMENTS_ERROR = 'ADD_PAYMENTS_ERROR';

export const LOAD_UNASSOCIATED_PAYMENTS = 'LOAD_UNASSOCIATED_PAYMENTS';
export const LOAD_UNASSOCIATED_PAYMENTS_SUCCESS = 'LOAD_UNASSOCIATED_PAYMENTS_SUCCESS';

export const UPDATE_GLOBAL_PAYMENTS_SETTINGS = 'UPDATE_GLOBAL_PAYMENTS_SETTINGS';
export const UPDATE_GLOBAL_PAYMENTS_SETTINGS_START = 'UPDATE_GLOBAL_PAYMENTS_SETTINGS_START';
export const UPDATE_GLOBAL_PAYMENTS_SETTINGS_SUCCESS = 'UPDATE_GLOBAL_PAYMENTS_SETTINGS_SUCCESS';
export const UPDATE_GLOBAL_PAYMENTS_SETTINGS_ERROR = 'UPDATE_GLOBAL_PAYMENTS_SETTINGS_ERROR';

export const ASSOCIATE_PAYMENT = 'ASSOCIATE_PAYMENT';
export const ASSOCIATE_PAYMENT_SUCCESS = 'ASSOCIATE_PAYMENT_SUCCESS';

export const LOAD_USER_PAYMENTS = 'LOAD_USER_PAYMENTS';
export const LOAD_USER_PAYMENTS_SUCCESS = 'LOAD_USER_PAYMENTS_SUCCESS';

export const LOAD_USERS_PAYMENTS = 'LOAD_USERS_PAYMENTS';
export const LOAD_USERS_PAYMENTS_SUCCESS = 'LOAD_USERS_PAYMENTS_SUCCESS';

export const OPEN_PAYMENT_ASSOCIATION_DIALOG = 'OPEN_PAYMENT_ASSOCIATION_DIALOG';
export const CLOSE_PAYMENT_ASSOCIATION_DIALOG = 'CLOSE_PAYMENT_ASSOCIATION_DIALOG';
export const CHANGE_ASSOCIATION_USER_ID = 'CHANGE_ASSOCIATION_USER_ID';
export const CREATE_USER_PAYMENTS_SETTINGS = 'CREATE_USER_PAYMENTS_SETTINGS';
export const CLOSE_USER_PAYMENTS_SETTINGS = 'CLOSE_USER_PAYMENTS_SETTINGS';

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

export function deletePayments(payments, userId) {
  return ({ fetch }) => ({
    type: DELETE_PAYMENTS,
    payload: {
      promise: fetch(`/users/${userId}/payments`, {
        credentials: 'same-origin',
        method: 'delete',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payments,
        }),
      }).then(response => response.json()),
    },
  });
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
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
        }),
      }).then(() => paymentId),
    },
  });
}

export function uploadPaymentsImport(files) {
  const data = new FormData();
  data.append('file', files[0]);

  return ({ fetch }) => ({
    type: UPLOAD_PAYMENTS_IMPORT,
    payload: {
      promise: fetch('/payments/import', {
        credentials: 'same-origin',
        notifications: 'both',
        headers: {},
        method: 'post',
        body: data,
      }).then(response => response.json()),
    },
  });
}

export function loadUsersPayments(userId) {
  if (userId) {
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

  return ({ fetch }) => ({
    type: LOAD_USERS_PAYMENTS,
    payload: {
      promise: fetch('/users/payments', {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json()),
    },
  });
}

export function addPayments(values, users) {
  return ({ fetch }) => ({
    type: ADD_PAYMENTS,
    payload: {
      promise: fetch('/payments', {
        credentials: 'same-origin',
        method: 'post',
        notifications: 'both',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          validFrom: values.validFrom.utc().format('YYYY-MM-DD'),
          deadlineAt: values.deadlineAt.utc().format('YYYY-MM-DD'),
          users: users.toList().toArray(),
        }),
      }),
    },
  });
}

export function fetchGlobalPaymentsSettings() {
  return ({ fetch }) => ({
    type: FETCH_GLOBAL_PAYMENTS_SETTINGS,
    payload: {
      promise: fetch('/paymentsSettings', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function updateGlobalPaymentSettings(data) {
  return ({ fetch }) => ({
    type: UPDATE_GLOBAL_PAYMENTS_SETTINGS,
    payload: {
      promise: fetch('/paymentsSettings', {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        credentials: 'same-origin',
        notifications: 'both',
        body: JSON.stringify({
          ...data,
          schoolFeeApplicableMonths: data.schoolFeeApplicableMonths.keySeq().map(month => month),
        }),
      }).then(response => response.json()),
    },
  });
}

export function loadUserPaymentsSettings(userId) {
  return ({ fetch }) => ({
    type: LOAD_USER_PAYMENTS_SETTINGS,
    payload: {
      promise: fetch(`/users/${userId}/paymentsSettings`, {
        headers: { 'Content-Type': 'application/json' },
        customStatusCheck: (response) => {
          if (response.status >= 200 && response.status < 300) {
            return response;
          }

          if (response.status === 404) {
            return response;
          }

          const error = new Error(response.statusText);
          error.response = response;

          throw error;
        },
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function updateUserPaymentSettings(data, userId) {
  return ({ fetch }) => ({
    type: UPDATE_USERS_PAYMENTS_SETTINGS,
    payload: {
      promise: fetch(`/users/${userId}/paymentsSettings`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        credentials: 'same-origin',
        notifications: 'both',
        body: JSON.stringify({
          ...data,
        }),
      }).then(response => response.json()),
    },
  });
}

export function createUserPaymentsSettings() {
  return {
    type: CREATE_USER_PAYMENTS_SETTINGS,
  };
}

export function closeUserPaymentsSettings() {
  return {
    type: CLOSE_USER_PAYMENTS_SETTINGS,
  };
}
