import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Spinner from 'react-spinkit';

import withStyles from 'material-ui/styles/withStyles';

import LoginPage from 'pages/LoginPage';
import PasswordRemindPage from 'pages/PasswordRemindPage';
import PasswordResetPage from 'pages/PasswordResetPage';
import Dashboard from 'layouts/Dashboard';
import { connect } from 'common/store';
import request from 'common/fetch';
import { isPublicPath } from 'common/utils';

// core components
import Footer from 'components/Footer/Footer';
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import Snackbar from 'components/Snackbar/Snackbar';

import bgImage from 'assets/img/register.jpeg';
import loadingPageStyle from 'assets/jss/material-dashboard-pro-react/views/loadingPageStyle';


class App extends Component {
  state = {
    isLoading: true,
  }

  componentDidMount() {
    const { history, actions, location } = this.props;
    if (isPublicPath(location.pathname)) {
      this.setState({ isLoading: false });
      return
    }

    request('/api/users/me', {
      credentials: 'same-origin',
      customStatusCheck: (response) => {
        if (response.status === 401) {
          history.push('/login');
          this.setState({ isLoading: false });
          throw new Error('Unauthorized');
        } else {
          return response;
        }
      }
    }).then(response => response.json())
      .then(
        (user) => {
          actions.setUser(user);
          history.push('/dashboard');
          this.setState({ isLoading: false });
        },
        (err) => {
          if (err.message !== 'Unauthorized') {
            throw err;
          }
          return null;
        }
      );
  }

  render() {
    const {
      classes,
      actions,
      history,
      match,
      user,
      notifications,
      location,
    } = this.props;

    const { isLoading } = this.state;

    return (
      <div>
        {location.pathname === '/login' || !user ? (
          <div className={classes.wrapper}>
            <div className={classes.fullPage}>
              <div className={classes.content}>
                <div className={classes.container}>
                  <GridContainer justify="center">
                    <ItemGrid xs={12} sm={6} md={4}>
                      {isLoading ? <Spinner name="line-scale-pulse-out" className={classes.loader} /> : null}
                    </ItemGrid>
                  </GridContainer>

                  <Route
                    exact
                    path="/login"
                    render={
                      () => <LoginPage actions={actions} history={history} />
                    }
                  />

                  <Route
                    exact
                    path="/password/remind"
                    render={
                      () => <PasswordRemindPage history={history} />
                    }
                  />

                  <Route
                    exact
                    path="/password/reset/:token"
                    render={
                      () => <PasswordResetPage />
                    }
                  />
                </div>
              </div>

              <Footer white />
              <div
                className={classes.fullPageBackground}
                style={{ backgroundImage: `url(${bgImage})` }}
              />
            </div>
          </div>
        ) : (
          <div>
            <Dashboard />
          </div>
        )}
        {notifications.valueSeq().map(notification => (
          <Snackbar
            key={notification.id}
            place={notification.place}
            color={notification.color}
            icon={notification.icon}
            message={notification.message}
            open
            closeNotification={() => actions.removeNotification(notification.id)}
            close
          />
        ))}
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({ user: state.user, notifications: state.notifications })),
  withStyles(loadingPageStyle),
)(App);
