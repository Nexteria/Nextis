import React from "react";
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

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

import passwordRemindPageStyle from "assets/jss/material-dashboard-pro-react/views/passwordRemindPageStyle.jsx";
import request from "common/fetch";

class PasswordResetPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      resetWasSuccessfull: null,
      passwordsMatch: null,
    };

    this.handleRequest = this.handleRequest.bind(this);
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

  handleRequest() {
    const { match, history } = this.props;

    if (this.passwordRef.value.length >= 6 && this.passwordRef.value === this.passwordConfirmationRef.value) {
        this.setState({ passwordsMatch: true })
    } else {
        this.setState({ passwordsMatch: false })
        return
    }

    request('/password/reset', {
      credentials: 'same-origin',
      method: 'post',
      redirect: 'manual',
      body: JSON.stringify({
        email: this.emailRef.value,
        password: this.passwordRef.value,
        password_confirmation: this.passwordConfirmationRef.value,
        token: match.params.token
      }),
    }).then(response => response.json()).then(
      () => {
          this.setState({ resetWasSuccessfull: true })
          setTimeout(() => window.location = '/dashboard', 1000)
      },
      () => this.setState({ resetWasSuccessfull: false })
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.content}>
        <div className={classes.container}>
          <GridContainer justify="center">
            <ItemGrid xs={12} sm={6} md={4} lg={4}>
              <form method="POST" action="/login" autoComplete="off" onSubmit={this.handleRequest}>
                <LoginCard
                  customCardClass={classes[this.state.cardAnimaton]}
                  footerAlign="center"
                  cardSubtitle="Obnovenie hesla"
                  footer={
                    this.state.resetWasSuccessfull === null ?
                      <Button
                        color="nexteriaOrangeNoBackground"
                        wd
                        size="lg"
                        onClick={this.handleRequest}
                      >
                        Zmeniť heslo
                      </Button>
                    : null
                  }
                  content={
                    this.state.resetWasSuccessfull === null ?
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
                            onKeyPress: (ev) => {
                                if(ev.key === 'Enter') {
                                this.handleRequest();
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
                            labelText="Nové heslo"
                            id="password"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            underline: classes.underline,
                            type: 'password',
                            inputRef: input => this.passwordRef = input,
                            onKeyPress: (ev) => {
                                if(ev.key === 'Enter') {
                                this.handleRequest();
                                ev.preventDefault();
                                }
                            },
                            autoFocus: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                <LockOpen className={classes.inputAdornmentIcon} />
                                </InputAdornment>
                            )
                            }}
                        />

                        <CustomInput
                            labelText="Potvrdenie hesla"
                            id="password_confirmation"
                            formControlProps={{
                            fullWidth: true
                            }}
                            inputProps={{
                            underline: classes.underline,
                            type: 'password',
                            inputRef: input => this.passwordConfirmationRef = input,
                            onKeyPress: (ev) => {
                                if(ev.key === 'Enter') {
                                this.handleRequest();
                                ev.preventDefault();
                                }
                            },
                            autoFocus: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                <LockOpen className={classes.inputAdornmentIcon} />
                                </InputAdornment>
                            )
                            }}
                        />
                        {this.state.passwordsMatch === false ? 'Heslo musí byť aspoň 6 znakov dlhé a zhodovať sa s potvrdením' : null}
                    </div>
                    :
                    <div>
                        {this.state.resetWasSuccessfull === true ?  <p>Zmena hesla bola úspešná.</p> : null}
                        {this.state.resetWasSuccessfull === false ?  <p>Zmena hesla zlyhala. Skúste znova</p> : null}
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

PasswordResetPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
    withRouter,
    withStyles(passwordRemindPageStyle)
)(PasswordResetPage);
