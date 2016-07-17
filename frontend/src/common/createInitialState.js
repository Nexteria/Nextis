import config from './config';
import configReducer from './config/reducer';
import intlReducer from './intl/reducer';

const descriptorsToMessages = descriptors =>
  descriptors.reduce((previous, { defaultMessage, id }) => ({
    ...previous, [id]: defaultMessage
  }), {});

function loadMessages(locales) {
  return locales.map(fileName => ({
      descriptors: require(`../../messages/${fileName}`),
      locale: fileName
    }))
    .reduce((previous, { descriptors, locale }) => ({
      ...previous, [locale]: descriptorsToMessages(descriptors)
    }), {});
}

const messages = loadMessages(config.locales)

export default function createInitialState() {
  return {
    config: configReducer(undefined, {})
      .set('appName', config.appName)
      .set('appVersion', config.appVersion)
      .set('sentryUrl', config.sentryUrl),
    intl: intlReducer(undefined, {})
      .set('currentLocale', config.defaultLocale)
      .set('defaultLocale', config.defaultLocale)
      .set('locales', config.locales)
      .set('messages', messages)
  };
}
