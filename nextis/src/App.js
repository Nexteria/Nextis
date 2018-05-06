import React, { Component } from 'react';
import { Route, withRouter } from "react-router-dom";
import { compose } from 'recompose';
import Spinner from 'react-spinkit';

import withStyles from "material-ui/styles/withStyles";

import LoginPage from "pages/LoginPage";
import Dashboard from "layouts/Dashboard";
import { connect } from "common/store";
import request from "common/fetch";

// core components
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";

import bgImage from "assets/img/register.jpeg";
import loadingPageStyle from "assets/jss/material-dashboard-pro-react/views/loadingPageStyle.jsx";


class App extends Component {
  state = {
    isLoading: true,
  }

  componentDidMount() {
    const { history, actions } = this.props;

    request('/api/users/me', {
      credentials: 'same-origin',
      customStatusCheck: (response) => {
        if (response.status === 401) {
          history.push('/login');
          this.setState({isLoading: false});
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
        this.setState({isLoading: false});
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
    const { classes, actions, history, user } = this.props;

    return (
      <div>
        {this.props.location.pathname === '/' || this.props.location.pathname === '/login' || !user ?
          <div className={classes.wrapper} ref="wrapper">
            <div className={classes.fullPage}>
              <div className={classes.content}>
                <div className={classes.container}>
                  <GridContainer justify="center">
                    <ItemGrid xs={12} sm={6} md={4}>
                      {this.state.isLoading ?
                        <Spinner name='line-scale-pulse-out' className={classes.loader} />
                        : null
                      }
                      <Route
                        exact
                        path={'/login'}
                        render={() =>
                          <LoginPage actions={actions} history={history} />
                        }
                      />
                    </ItemGrid>
                  </GridContainer>
                </div>
              </div>

              <Footer white />
              <div
                className={classes.fullPageBackground}
                style={{ backgroundImage: "url(" + bgImage + ")" }}
              />
            </div>
          </div>
          :
          <div>
            <Dashboard />
          </div>
        }
      </div>
    );
  }
}

export default compose(
  connect(state => ({ user: state.user })),
  withStyles(loadingPageStyle),
  withRouter,
)(App);

