import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import { connect } from 'common/store';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import HeaderCard from 'components/Cards/HeaderCard';
import FormLabel from '@material-ui/core/FormLabel';
import CustomInput from 'components/CustomInput/CustomInput';
import Button from 'components/CustomButtons/Button';
import Spinner from 'react-spinkit';

import passwordChangeStyle from 'assets/jss/material-dashboard-pro-react/views/passwordChangeStyle';

class PasswordChange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
      updating: false,
      isPassMatching: null,
    };

    this.changePassword = this.changePassword.bind(this);
  }

  changePassword() {
    const { newPassword, newPasswordConfirmation, oldPassword } = this.state;
    const { changePassword, userId, actions } = this.props;

    if (newPassword !== newPasswordConfirmation) {
      this.setState({ isPassMatching: false });
    } else {
      this.setState({ isPassMatching: true, updating: true });

      changePassword({
        variables: {
          userId,
          oldPassword,
          newPassword,
          newPasswordConfirmation,
        }
      }).then(() => {
        actions.setNotification({
          id: 'passwordChange',
          place: 'tr',
          color: 'success',
          message: 'Heslo bolo zmenené'
        });

        this.setState({ updating: false });
      }).catch(() => {
        actions.setNotification({
          id: 'passwordChange',
          place: 'tr',
          color: 'danger',
          message: 'Pri zmene hesla došlo k chybe. Skúste znova prosím!'
        });

        this.setState({ updating: false });
      });
    }
  }

  render() {
    const {
      classes,
    } = this.props;

    const {
      oldPassword,
      newPassword,
      newPasswordConfirmation,
      updating,
      isPassMatching,
    } = this.state;

    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={12} md={10} lg={8}>
          <HeaderCard
            cardTitle="Zmena hesla"
            headerColor="orange"
            content={(
              <GridContainer>
                <ItemGrid xs={12}>
                  <GridContainer>
                    <ItemGrid xs={12} sm={2} className={classes.labelRow}>
                      <FormLabel
                        className={
                          classes.labelHorizontal
                        }
                      >
                        Pôvodné heslo
                      </FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={10} className={classes.inputRow}>
                      <CustomInput
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => this.setState({
                            oldPassword: event.target.value,
                          }),
                          underline: classes.underline,
                          value: oldPassword,
                          type: 'password',
                        }}
                      />
                    </ItemGrid>
                  </GridContainer>
                </ItemGrid>

                <ItemGrid xs={12}>
                  <GridContainer>
                    <ItemGrid xs={12} sm={2} className={classes.labelRow}>
                      <FormLabel
                        className={
                          classes.labelHorizontal
                        }
                      >
                        Nové heslo
                      </FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={10} className={classes.inputRow}>
                      <CustomInput
                        formControlProps={{
                          fullWidth: true
                        }}
                        error={isPassMatching === false}
                        inputProps={{
                          onChange: event => this.setState({
                            newPassword: event.target.value,
                          }),
                          underline: classes.underline,
                          value: newPassword,
                          type: 'password',
                        }}
                      />
                      {isPassMatching === false ? (
                        <div className={classes.inputErrorContainer}>
                          Heslá sa nezhodujú
                        </div>
                      ) : null}
                    </ItemGrid>
                  </GridContainer>
                </ItemGrid>

                <ItemGrid xs={12}>
                  <GridContainer>
                    <ItemGrid xs={12} sm={2} className={classes.labelRow}>
                      <FormLabel
                        className={
                          classes.labelHorizontal
                        }
                      >
                        Nové heslo znova
                      </FormLabel>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={10} className={classes.inputRow}>
                      <CustomInput
                        formControlProps={{
                          fullWidth: true
                        }}
                        error={isPassMatching === false}
                        inputProps={{
                          onChange: event => this.setState({
                            newPasswordConfirmation: event.target.value,
                          }),
                          underline: classes.underline,
                          value: newPasswordConfirmation,
                          type: 'password',
                        }}
                      />
                      {isPassMatching === false ? (
                        <div className={classes.inputErrorContainer}>
                          Heslá sa nezhodujú
                        </div>
                      ) : null}
                    </ItemGrid>
                  </GridContainer>
                </ItemGrid>
                <GridContainer>
                  <ItemGrid xs={12} className={classes.actionButtonContainer}>
                    <Button color="nexteriaOrange" onClick={this.changePassword} disabled={updating}>
                      {updating === true ? (
                        <Spinner
                          name="line-scale-pulse-out"
                          fadeIn="none"
                          className={classes.buttonSpinner}
                          color="#fff"
                        />
                      ) : (
                        <span>
                        Zmeniť
                        </span>
                      )}
                    </Button>
                  </ItemGrid>
                </GridContainer>
              </GridContainer>
            )}
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

const passwordMutation = gql`
  mutation PasswordChange(
  $userId: Int!
  $oldPassword: String!
  $newPassword: String!
  $newPasswordConfirmation: String!
  ) {
    PasswordChange(
      userId: $userId
      oldPassword: $oldPassword
      newPassword: $newPassword
      newPasswordConfirmation: $newPasswordConfirmation
    ) {
      id
    }
  }
`;

export default compose(
  connect(state => ({ userId: state.user.id })),
  withStyles(passwordChangeStyle),
  graphql(passwordMutation, { name: 'changePassword' }),
)(PasswordChange);
