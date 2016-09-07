import Raven from 'raven-js';

// bluebirdjs.com/docs/api/error-management-configuration.html#global-rejection-events
const register = unhandledRejection => unhandledRejection(event => {
  event.preventDefault();
  let error = null;
  if (event.detail) {
    error = event.detail.reason;
  } else {
    error = event;
  }

  if (process.env.NODE_ENV === 'production') {
    // "error.reason || error" because redux-promise-middleware
    Raven.captureException(error.reason || error);
    // We can use also Raven.lastEventId() and Raven.showReportDialog().
    // Check docs.getsentry.com/hosted/clients/javascript/usage
  } else {
    /* eslint-disable no-console */
    console.warn('Unhandled promise rejection. Fix it or it will be reported.');
    console.warn(error);
    /* eslint-enable no-console */
  }
});

const setRavenUserContext = authData => {
  if (!authData) {
    Raven.setUserContext();
    return;
  }
  Raven.setUserContext({
    email: authData.token.email,
    id: authData.id
  });
};

const reportingMiddleware = () => next => action => {
  // TODO: Use Raven.setExtraContext for last 10 actions and limited app state.
  return next(action);
};

export default function configureReporting(options) {
  const { appVersion, sentryUrl, unhandledRejection } = options;
  Raven.config(sentryUrl, {
    release: appVersion
    // TODO: serverName: device.uid
    // TODO: Add list of common ignore rules from
    // docs.getsentry.com/hosted/clients/javascript/tips/#decluttering-sentry
  }).install();
  register(unhandledRejection);
  return reportingMiddleware;
}
