import React from "react";
import * as Sentry from '@sentry/browser';
import PropTypes from "prop-types";
import { Link } from  'react-router-dom'

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import InputAdornment from "material-ui/Input/InputAdornment";

// @material-ui/icons
import Email from "@material-ui/icons/Email";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import LoginCard from "components/Cards/LoginCard.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import passwordRemindPageStyle from "assets/jss/material-dashboard-pro-react/views/passwordRemindPageStyle.jsx";
import request from "common/fetch";

class PasswordRecoveryRequestPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      resetIsProcessed: null,
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
    this.setState({ resetIsProcessed: true })
    request('/password/email', {
      credentials: 'same-origin',
      redirect: 'manual',
      method: 'post',
      body: JSON.stringify({
        email: this.emailRef.value,
      }),
    }).then(
      () => this.setState({ resetIsProcessed: true }),
      () => this.setState({ resetIsProcessed: false })
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
                    this.state.resetIsProcessed === null ?
                      <Button
                        color="nexteriaOrangeNoBackground"
                        wd
                        size="lg"
                        onClick={this.handleRequest}
                      >
                        Zaslať inštrukcie
                      </Button>
                    : null
                  }
                  content={
                    <div>
                      <div>
                      {this.state.resetIsProcessed === null ?
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
                        </div>
                      : null}
                      </div>
                      <div>
                        {this.state.resetIsProcessed === true ?
                          <p>Ak zadaný email evidujeme v systéme, budú naň odoslané inštrukcie potrebné na resetovanie hesla.</p>
                        : null}
                      </div>
                      <div>
                        {this.state.resetIsProcessed === false ?
                          <p>Email bol v neplatnom formáte.</p>
                        : null}
                      </div>
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

PasswordRecoveryRequestPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(passwordRemindPageStyle)(PasswordRecoveryRequestPage);
