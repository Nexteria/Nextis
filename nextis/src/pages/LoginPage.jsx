import React from 'react';
import * as Sentry from '@sentry/browser';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import queryString from 'query-string';

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOpen from "@material-ui/icons/LockOpen";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import LoginCard from "components/Cards/LoginCard.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import request from "common/fetch";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      loginFailed: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  handleLogin() {
    const { history, actions, location } = this.props;

    const values = queryString.parse(location.search);

    request('/login', {
      credentials: 'same-origin',
      method: 'post',
      body: JSON.stringify({
        password: this.passwordRef.value,
        email: this.emailRef.value,
      }),
    }).then(response => response.json()).then(
      (data) => {
        actions.setUser(data);
        history.push(values.redirect || '/dashboard');
        this.setState({ loginFailed: false });
        Sentry.configureScope((scope) => {
          scope.setUser({
            id: data.user.id,
            firstName: data.user.firstName,
            lastName: data.user.lastName
          });
        });
      },
      () => this.setState({ loginFailed: true })
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.content}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <ItemGrid xs={12} sm={6} md={4} lg={4}>
              <form method="POST" action="/login" autoComplete="off" onSubmit={this.handleLogin}>
                <LoginCard
                  customCardClass={classes[this.state.cardAnimaton]}
                  footerAlign="center"
                  footer={
                    <Button
                      color="nexteriaOrangeNoBackground"
                      wd
                      size="lg"
                      onClick={this.handleLogin}
                    >
                      Prihlásiť
                    </Button>
                  }
                  content={
                    <div>
                      <input type="hidden" name="_token" value={window.csrf_token} />
                      <CustomInput
                        labelText="Email..."
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                        labelProps={{
                          FormLabelClasses: {
                            focused: classes.labelFocused,
                          }
                        }}
                        inputProps={{
                          underline: classes.underline,
                          type: 'email',
                          inputRef: input => this.emailRef = input,
                          onKeyPress: (ev) => {
                            if(ev.key === 'Enter') {
                              this.handleLogin();
                              ev.preventDefault();
                            }
                          },
                          autoFocus: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputAdornmentIcon} />
                            </InputAdornment>
                          )
                        }}
                      />
                      <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          fullWidth: true
                        }}
                        labelProps={{
                          FormLabelClasses: {
                            focused: classes.labelFocused,
                          }
                        }}
                        inputProps={{
                          type: "password",
                          inputRef: input => this.passwordRef = input,
                          autoComplete: "off",
                          underline: classes.underline,
                          onKeyPress: (ev) => {
                            if(ev.key === 'Enter') {
                              this.handleLogin();
                              ev.preventDefault();
                            }
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <LockOpen
                                className={classes.inputAdornmentIcon}
                              />
                            </InputAdornment>
                          )
                        }}
                      />

                      <div className={classes.resetPasswordContainer}>
                        <Link to="/password/remind" className={classes.resetPassword}>Zabudnuté heslo?</Link>
                      </div>

                      {this.state.loginFailed ?
                        <div className={classes.loginError}>Neplatné meno / heslo. Skús znova.</div>
                        : null
                      }
                    </div>
                  }
                />
              </form>
            </ItemGrid>
          </GridContainer>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  withStyles(loginPageStyle),
  withRouter,
)(LoginPage);
