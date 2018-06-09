import isomorphicFetch from 'isomorphic-fetch';

import URI from 'urijs';


function ensureAbsoluteUrl(apiUrl, input) {
  if (typeof input !== 'string') return input;
  if (URI(input).is('absolute')) return input;

  return URI(apiUrl + input).normalize().toString();
}

function checkStatus(response, notifications) {
  if (response.status >= 200 && response.status < 300) {
    /* if (notifications === 'both' || notifications === 'success-only') {
      toastr.options.closeButton = true;
      toastr.options.timeOut = 10000;
      toastr.success("Operation was successful");
    } */
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;

  /* if (notifications === 'both' || notifications === 'error-only') {
    if (response.status === 500) {
      toastr.error('INTERNAL SERVER ERROR');
    } else {
      response.json().then(resp => {
        toastr.options.closeButton = true;
        toastr.options.timeOut = 0;
        toastr.error(resp.error);
      });
    }
  } */

  throw error;
}

// Wrapper over isomorphicFetch making relative urls absolute. We don't want
// hardcode fetch urls since they are different when app is deployed or not.
export default function fetch(input, init) {
  let apiUrl = process.env.REACT_APP_SERVER_URL;
  let notifications = 'error-only';
  if (init.hasOwnProperty('api')) {
    apiUrl = init.api;
    delete init['api'];
  }

  if (init.hasOwnProperty('notifications')) {
    notifications = init.notifications;
    delete init['notifications'];
  }

  if (!init.hasOwnProperty('disableCredentials')) {
    init['credentials'] = 'include';
  }

  if (!init.hasOwnProperty('headers')) {
    init['headers'] = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
    };
  }

  let customStatusCheck = response => checkStatus(response, notifications);
  if (init.hasOwnProperty('customStatusCheck')) {
    customStatusCheck = init.customStatusCheck;
    delete init['customStatusCheck'];
  }

  input = ensureAbsoluteUrl(apiUrl, input);
  return isomorphicFetch(input, init).then(customStatusCheck, customStatusCheck);
}
