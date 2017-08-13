export const FETCH_EVENT_SIGNIN_INFO = 'FETCH_EVENT_SIGNIN_INFO';
export const FETCH_EVENT_SIGNIN_INFO_START = 'FETCH_EVENT_SIGNIN_INFO_START';
export const FETCH_EVENT_SIGNIN_INFO_SUCCESS = 'FETCH_EVENT_SIGNIN_INFO_SUCCESS';
export const FETCH_EVENT_SIGNIN_INFO_ERROR = 'FETCH_EVENT_SIGNIN_INFO_ERROR';

export const ATTENDEE_TOKEN_SIGN_IN = 'ATTENDEE_TOKEN_SIGN_IN';
export const ATTENDEE_TOKEN_SIGN_IN_START = 'ATTENDEE_TOKEN_SIGN_IN_START';
export const ATTENDEE_TOKEN_SIGN_IN_SUCCESS = 'ATTENDEE_TOKEN_SIGN_IN_SUCCESS';
export const ATTENDEE_TOKEN_SIGN_IN_ERROR = 'ATTENDEE_TOKEN_SIGN_IN_ERROR';

export const ATTENDEE_TOKEN_WONT_GO = 'ATTENDEE_TOKEN_WONT_GO';
export const ATTENDEE_TOKEN_WONT_GO_START = 'ATTENDEE_TOKEN_WONT_GO_START';
export const ATTENDEE_TOKEN_WONT_GO_SUCCESS = 'ATTENDEE_TOKEN_WONT_GO_SUCCESS';
export const ATTENDEE_TOKEN_WONT_GO_ERROR = 'ATTENDEE_TOKEN_WONT_GO_ERROR';


export function fetchEventSigninInfo(token) {
  return ({ fetch }) => ({
    type: FETCH_EVENT_SIGNIN_INFO,
    payload: {
      promise: fetch(`/nxEvents/${token}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      }).then(response => response.json()),
    },
  });
}

export function eventWontGo(token, reason) {
  return ({ fetch }) => ({
    type: ATTENDEE_TOKEN_WONT_GO,
    payload: {
      promise: fetch(`/nxEvents/${token}/wontGo`, {
        method: 'put',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wontGo: true,
          reason,
        }),
      }).then(response => response.json())
    },
  });
}

export function attendeeSignIn(token, questionForm) {
  return ({ fetch }) => ({
    type: ATTENDEE_TOKEN_SIGN_IN,
    payload: {
      promise: fetch(`/nxEvents/${token}/signIn`, {
        method: 'put',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signIn: true,
          questionForm: questionForm.formData,
        }),
      }).then(response => response.json())
    },
  });
}
