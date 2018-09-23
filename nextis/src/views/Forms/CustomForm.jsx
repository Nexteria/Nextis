import React from 'react';
import { compose } from 'recompose';
import { connect } from 'common/store';
import validator from 'validator';
import Datetime from 'react-datetime';
import Spinner from 'react-spinkit';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import FormLabel from '@material-ui/core/FormLabel';
import CustomInput from 'components/CustomInput/CustomInput';
import Check from '@material-ui/icons/Check';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Checkbox from '@material-ui/core/Checkbox';

import Button from 'components/CustomButtons/Button';
import CustomEditor, { stateFromHTML } from 'components/CustomEditor/CustomEditor';

import customFormStyle from 'assets/jss/material-dashboard-pro-react/views/customFormStyle';


class CustomForm extends React.Component {
  constructor(props) {
    super(props);

    const stateValues = {
      updating: false,
    };

    props.formItems.forEach((item) => {
      if (item.component === 'date') {
          stateValues[item.id] = parse(item.value);
      } else if (item.component === 'editor') {
          stateValues[item.id] = stateFromHTML(item.value || '');
      } else {
          stateValues[item.id] = item.value || '';
      }
      stateValues[`${item.id}Errors`] = null;
    });

    this.state = stateValues;

    this.update = this.update.bind(this);
    this.validate = this.validate.bind(this);
  }

  validate(fieldId, component, value, validations) {
    const errors = [];

    if (component === 'editor') {
      value = value.toString('html');
    } else if (component === 'date') {
      value = format(value, 'MM/DD/YYYY');
    }

    validations.forEach((type) => {
      switch (type) {
        case 'required': {
          if (!value || (value.trim && !value.trim().length)) {
            errors.push('Položka je povinná!');
          }
          break;
        }

        case 'medium-text': {
          if (value.trim().length < 150) {
            errors.push(
              `Položka musí mať minimálne 150 znakov! (${value.trim().length})`
            );
          }
          if (value.trim().length > 600) {
            errors.push(
              `Položka môže mať maximálne 600 znakov! (${value.trim().length})`
            );
          }
          break;
        }

        case 'email': {
          if (!validator.isEmail(value)) {
            errors.push('Položka musí byť v tvare emailu!');
          }
          break;
        }

        case 'number': {
          if (!validator.isNumeric(value)) {
            errors.push('Položka musí byť číslo!');
          }
          break;
        }

        case 'phone': {
          if (!validator.isMobilePhone(value, 'sk-SK')) {
            errors.push('Položka musí telefónne číslo!');
          }
          break;
        }

        case 'url': {
          if (value && !validator.isURL(value, { require_protocol: true })) {
            errors.push('Položka musí byť url adresa!');
          }
          break;
        }

        case 'date': {
          if ((new Date(value)) == 'Invalid Date') {
            errors.push('Položka musí byť valídny dátum!');
          }
          break;
        }

        default: {
          break;
        }
      }
    });

    this.setState({ [`${fieldId}Errors`]: errors });
    return errors.length === 0;
  }

  change(value, stateName, type, validation) {
    this.validate(stateName, type, value, validation);

    // set value
    switch (type) {
      case 'checkbox':
        this.setState({ [stateName]: value });
        break;
      case 'date':
        this.setState({ [stateName]: value });
        break;
      default:
        this.setState({ [stateName]: value });
        break;
    }
  }

  async update() {
    this.setState({ updating: true });
    const { formItems, actions } = this.props;

    let isFormValid = true;
    const values = {};
    formItems.forEach((item) => {
      let { [item.id]: formValue } = this.state;

      const result = this.validate(
        item.id,
        item.component,
        formValue,
        item.validation
      );

      if (!result) {
        isFormValid = false;
      }

      if (!formValue && Object.prototype.hasOwnProperty.call(item, 'defaultValue')) {
        formValue = item.defaultValue;
      }

      if (item.component === 'editor') {
        values[item.id] = formValue.toString('html');
      } else if (item.component === 'date') {
        values[item.id] = format(formValue, 'YYYY-MM-DD');
      } else {
        values[item.id] = formValue;
      }
    });

    if (isFormValid) {
      const data = {};
      formItems.forEach(formItem => {
        if (formItem.component === 'editor') {
          data[formItem.id] = this.state[formItem.id].toString('html');
        } else {
          data[formItem.id] = this.state[formItem.id];
        }
      })

      await this.props.buttonAction(data)
      this.setState({ updating: false });
    } else {
      actions.setNotification({
        id: 'updateForm',
        place: 'tr',
        color: 'danger',
        message: 'Prosím najskôr oprav zvýraznené chyby'
      });
      this.setState({ updating: false });
    }
    this.setState({ updating: false });
  }

  render() {
    const {
      classes,
      formItems,
      buttonText,
      buttonColor,
    } = this.props;

    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={12} md={10} lg={8}>
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
                  <ItemGrid xs={12} sm={2} className={classes.labelRow}>
                    <FormLabel
                      className={
                        classes.labelHorizontal + ' ' + labelAdditionalClass
                      }
                    >
                      {item.label}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10} className={classes.inputRow}>
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

                    {item.component === 'checkbox' ? (
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => this.change(
                          !this.state[item.id],
                          item.id,
                          item.type,
                          item.validation
                        )}
                        checkedIcon={
                          <Check className={classes.checkedIcon} />
                        }
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkboxRoot,
                        }}
                        checked={this.state[item.id]}
                      />
                    ) : null}

                    {item.component === 'select' ? (
                      <Select
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={this.state[item.id] || item.defaultValue || ''}
                        onChange={(event) => this.change(
                          event.target.value,
                          item.id,
                          item.type,
                          item.validation
                        )}
                        disabled={item.disabled}
                        inputProps={{
                          name: item.id,
                          id: item.id
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                        >
                          Vyber hodnotu
                        </MenuItem>
                        {item.options.map(option => (
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            key={option.value}
                            value={option.value}
                          >
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : null}

                    {item.component === 'date' ? (
                      <Datetime
                        timeFormat={false}
                        onChange={value => this.change(
                          value,
                          item.id,
                          item.type,
                          item.validation
                        )
                        }
                        value={this.state[item.id]}
                      />
                    ) : null}
                    {item.component === 'editor' ? (
                      <CustomEditor
                        className={classes.textEditor}
                        toolbarClassName={classes.textEditorToolbar}
                        editorState={this.state[item.id]}
                        onChange={state => this.change(
                          state,
                          item.id,
                          item.type,
                          item.validation
                        )}
                      />
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
                <ItemGrid xs={12} className={classes.actionButtonContainer}>
                  <Button color={buttonColor || "nexteriaOrange"} onClick={this.update} disabled={this.state.updating}>
                  {this.state.updating === true ? (
                    <Spinner
                      name="line-scale-pulse-out"
                      fadeIn="none"
                      className={classes.buttonSpinner}
                      color="#fff"
                    />
                  ) : <span>{buttonText}</span>}
                  </Button>
                </ItemGrid>
              </GridContainer>
          </form>
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default compose(
  connect(state => ({})),
  withStyles(customFormStyle)
)(CustomForm);