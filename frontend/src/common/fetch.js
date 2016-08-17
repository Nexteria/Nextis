import isomorphicFetch from 'isomorphic-fetch';

import URI from 'urijs';
import config from './config';
import toastr from 'toastr';


function ensureAbsoluteUrl(apiUrl, input) {
  if (typeof input !== 'string') return input;
  if (URI(input).is('absolute')) return input;

  return URI(apiUrl + input).normalize().toString();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;

  if (response.status === 500) {
    toastr.error('INTERNAL SERVER ERROR');
  } else {
    response.json().then(resp => {
      toastr.options.closeButton = true;
      toastr.options.timeOut = 15000;
      toastr.error(resp.error);
    });
  }

  throw error;
}

// Wrapper over isomorphicFetch making relative urls absolute. We don't want
// hardcode fetch urls since they are different when app is deployed or not.
export default function fetch(input, init) {
  let apiUrl = config.APIS.default;
  if (init.hasOwnProperty('api')) {
    apiUrl = init.api;
    delete init['api'];
  }

  let customStatusCheck = checkStatus;
  if (init.hasOwnProperty('customStatusCheck')) {
    customStatusCheck = init.customStatusCheck;
    delete init['customStatusCheck'];
  }

  input = ensureAbsoluteUrl(apiUrl, input);
  return isomorphicFetch(input, init).then(customStatusCheck);
}
