import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import validator from 'validator';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'common/store';
import Spinner from 'react-spinkit';
import { withRouter } from 'react-router-dom';
import ItemGrid from 'components/Grid/ItemGrid';

import MenuItem from '@material-ui/core/MenuItem';
import Button from 'components/CustomButtons/Button';
import Select from '@material-ui/core/Select';

import GridContainer from 'components/Grid/GridContainer';
import FormLabel from '@material-ui/core/FormLabel';
import CustomInput from 'components/CustomInput/CustomInput';
import FormControl from '@material-ui/core/FormControl';

import { eventTypes } from 'common/constants';

import styles from 'assets/jss/material-dashboard-pro-react/views/profileStyle';

const formItems = [
  {
    label: 'Semester *',
    type: 'text',
    component: 'select',
    id: 'semesterId',
    validation: ['required'],
    choices: [],
  },
  {
    label: 'Názov aktivity *',
    type: 'text',
    component: 'input',
    id: 'activityName',
    validation: ['required']
  },
  {
    label: 'Typ aktivity *',
    type: 'text',
    component: 'select',
    id: 'eventType',
    validation: ['required'],
    choices: eventTypes,
  },
  {
    label: 'Aktivita *',
    type: 'text',
    component: 'select',
    id: 'activityModelId',
    validation: ['required'],
    choices: [],
  },
  {
    label: 'Získané body *',
    type: 'number',
    component: 'input',
    id: 'gainedPoints',
    validation: ['required', 'number']
  },
  {
    label: 'Maximálne možné body *',
    type: 'number',
    component: 'input',
    id: 'maxPossiblePoints',
    validation: ['required', 'number']
  },
  {
    label: 'Poznámka',
    type: 'text',
    component: 'input',
    id: 'note',
    validation: []
  },
];

class AddActivityPoints extends React.Component {
  constructor(props) {
    super(props);

    const stateValues = {
      isProfileInitialized: false
    };

    formItems.forEach((item) => {
      stateValues[item.id] = '';
      stateValues[`${item.id}Errors`] = null;
    });
    this.state = stateValues;

    this.change = this.change.bind(this);
  }

  change(value, stateName, type, validation) {
    this.validate(stateName, type, value, validation);

    this.setState({ [stateName]: value });
  }

  render() {
    const {
      data,
      classes,
    } = this.props;

    const {
      activityType,
      gainedPoints,
      maxPossiblePoints,
      name,
    } = this.state;

    return (
      <form key={1} className={classes.profileForm}>
        {formItems.map((item) => {
          const hasError =
            this.state[`${item.id}Errors`] &&
            this.state[`${item.id}Errors`].length > 0;
          const labelAdditionalClass = hasError
            ? classes.labelErrorContainer
            : '';
          return (
            <GridContainer key={item.id}>
              <ItemGrid xs={12} sm={2}>
                <FormLabel
                  className={
                    classes.labelHorizontal + ' ' + labelAdditionalClass
                  }
                >
                  {item.label}
                </FormLabel>
              </ItemGrid>
              <ItemGrid xs={12} sm={10}>
                {item.component === 'input' ? (
                  <CustomInput
                    success={
                      this.state[`${item.id}Errors`] &&
                      this.state[`${item.id}Errors`].length === 0
                    }
                    error={hasError}
                    id={item.id}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => this.change(
                        event.target.value,
                        item.id,
                        item.type,
                        item.validation
                      ),
                      type: item.type,
                      underline: classes.underline,
                      value: this.state[item.id]
                    }}
                  />
                ) : null}
                {item.component === 'select' ? (
                  <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                  >
                    <Select
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={this.state[item.id]}
                      onChange={event => this.change(
                        event.target.value,
                        item.id,
                        item.type,
                        item.validation
                      )}
                      inputProps={{
                        name: item.id,
                        id: item.id,
                      }}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem
                        }}
                      >
                        {'Vyber hodnotu'}
                      </MenuItem>
                      {item.choices.map(choice => (
                        <MenuItem
                          key={choice.value}
                          classes={{
                            root: classes.selectMenuItem,
                            selected: classes.selectMenuItemSelected
                          }}
                          value={choice.value}
                        >
                          {choice.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null}
                {hasError ? (
                <div className={classes.inputErrorContainer}>
                  {this.state[`${item.id}Errors`].map(error => (
                  <span key={error}>{error} </span>
                  ))}
                </div>
                ) : null}
              </ItemGrid>
            </GridContainer>
          );
          })}
          <GridContainer>
          <ItemGrid xs={12}>
            <Button color="nexteriaOrange" onClick={this.updateProfile}>
            {this.state.updating === true ? (
              <Spinner
                name="line-scale-pulse-out"
                fadeIn="none"
                className={classes.buttonSpinner}
                color="#fff"
              />
            ) : (
              'Aktualizovať profil'
              )}
            </Button>
          </ItemGrid>
          </GridContainer>
      </form>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Povinné pole';
  }

  if (!values.activityType) {
    errors.activityType = 'Povinné pole';
  }

  if (values.activityType === 'event') {
    if (!values.activityModelId) {
      errors.activityModelId = 'Povinné pole';
    }
  }

  if (!values.maxPossiblePoints) {
    errors.maxPossiblePoints = 'Povinné pole';
  } else if (!validator.isNumeric(values.maxPossiblePoints)) {
    errors.maxPossiblePoints = 'Hodnota musí byť číslo';
  }

  if (!values.gainedPoints) {
    errors.gainedPoints = 'Povinné pole';
  } else if (!validator.isNumeric(values.gainedPoints)) {
    errors.gainedPoints = 'Hodnota musí byť číslo';
  }

  return errors;
};

const eventsQuery = gql`
query FetchEvents {
  events {
    id
    name
  }
}
`;

export default compose(
  withRouter,
  connect(state => ({ user: state.user })),
  withStyles(styles),
  graphql(eventsQuery, {
    options: (props) => {
      const { user } = props;

      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          id: user.id,
        },
      };
    }
  }),
)(AddActivityPoints);
