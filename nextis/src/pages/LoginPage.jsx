import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import InputAdornment from "material-ui/Input/InputAdornment";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutline";

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
    const { history, actions } = this.props;

    request('/login', {
      credentials: 'same-origin',
      method: 'post',
      body: JSON.stringify({
        password: this.passwordRef.value,
        email: this.emailRef.value,
      }),
    }).then(response => response.json()).then(
      (user) => {
        actions.setUser(user);
        history.push('/dashboard');
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
                      Let's Go
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
                        inputProps={{
                          underline: classes.underline,
                          type: 'email',
                          inputRef: input => this.emailRef = input,
                          onKeyPress: (ev) => ev.key === 'Enter' ? this.handleLogin() : null,
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
                        inputProps={{
                          type: "password",
                          inputRef: input => this.passwordRef = input,
                          autoComplete: "off",
                          underline: classes.underline,
                          onKeyPress: (ev) => ev.key === 'Enter' ? this.handleLogin() : null,
                          endAdornment: (
                            <InputAdornment position="end">
                              <LockOutline
                                className={classes.inputAdornmentIcon}
                              />
                            </InputAdornment>
                          )
                        }}
                      />
                      {this.state.loginFailed ?
                        <div className={classes.loginError}>Invalid login information. Try again.</div>
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

export default withStyles(loginPageStyle)(LoginPage);
