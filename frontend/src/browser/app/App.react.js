import './App.scss';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { locationShape } from 'react-router';


import favicon from '../../common/app/favicon';
import start from '../../common/app/start';
import AppSidebar from './AppSidebar';
import Header from './Header';
import Footer from './Footer';

// v4-alpha.getbootstrap.com/getting-started/introduction/#starter-template
const bootstrap4Metas = [
  { charset: 'utf-8' },
  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
  },
  {
    'http-equiv': 'x-ua-compatible',
    content: 'ie=edge'
  }
];

class App extends Component {

  static propTypes = {
    children: PropTypes.object,
    currentLocale: PropTypes.string.isRequired,
    location: locationShape,
    viewer: PropTypes.object,
    users: PropTypes.object,
  };

  render() {
    const { children, currentLocale, location, viewer, users } = this.props;

    if (!viewer || !users) {
      return <div></div>;
    }

    return (
      <div className="wrapper">
        <Helmet
          htmlAttributes={{ lang: currentLocale }}
          titleTemplate="%s - Nexteria IS"
          meta={[
            ...bootstrap4Metas,
            {
              name: 'description',
              content: 'Nexteria IT system'
            },
            ...favicon.meta
          ]}
          link={[
            ...favicon.link
          ]}
        />
        {/* Pass location to ensure header active links are updated. */}
        <Header {...{ viewer }} location={location} />
        <AppSidebar {...{ viewer }} ref="main-footer" />
        <div className="content-wrapper">
          {children}
        </div>
        <Footer />
      </div>
    );
  }

}

App = start(App);

export default connect(state => ({
  currentLocale: state.intl.currentLocale,
  viewer: state.users.viewer,
  users: state.users.users,
}))(App);
