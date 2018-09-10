import React from 'react';
import validator from 'validator';
import Datetime from 'react-datetime';
import Spinner from 'react-spinkit';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import FormLabel from 'material-ui/Form/FormLabel';
import CustomInput from 'components/CustomInput/CustomInput';

import Button from 'components/CustomButtons/Button';
import CustomEditor, { stateFromHTML } from 'components/CustomEditor/CustomEditor';

import profileStyle from 'assets/jss/material-dashboard-pro-react/views/profileStyle';

const formItems = [
  {
    label: 'Meno *',
    type: 'text',
    component: 'input',
    id: 'firstName',
    validation: ['required']
  },
  {
    label: 'Priezvisko *',
    type: 'text',
    component: 'input',
    id: 'lastName',
    validation: ['required']
  },
  {
    label: 'Dátum narodenia *',
    type: 'date',
    component: 'date',
    id: 'dateOfBirth',
    validation: ['required', 'date']
  },
  {
    label: 'Niečo o Tebe *',
    type: 'editor',
    component: 'editor',
    id: 'personalDescription',
    validation: ['required', 'medium-text']
  },
  {
    label: 'Hobby',
    type: 'editor',
    component: 'editor',
    id: 'hobby',
    validation: []
  },
  {
    label: 'Email *',
    type: 'text',
    component: 'input',
    id: 'email',
    validation: ['required', 'email']
  },
  {
    label: 'Telefón *',
    type: 'text',
    component: 'input',
    id: 'phone',
    validation: ['required', 'phone']
  },
  {
    label: 'Facebook url',
    type: 'text',
    component: 'input',
    id: 'facebookLink',
    validation: ['url'],
    defaultValue: '',
  },
  {
    label: 'LinkedIn url',
    type: 'text',
    component: 'input',
    id: 'linkedinLink',
    validation: ['url'],
    defaultValue: '',
  },
  {
    label: 'Škola *',
    type: 'text',
    component: 'input',
    id: 'school',
    validation: ['required']
  },
  {
    label: 'Fakulta *',
    type: 'text',
    component: 'input',
    id: 'faculty',
    validation: ['required']
  },
  {
    label: 'Štúdijný program *',
    type: 'text',
    component: 'input',
    id: 'studyProgram',
    validation: ['required']
  },
  {
    label: 'Rok štúdia *',
    type: 'text',
    component: 'input',
    id: 'studyYear',
    validation: ['required']
  },
  {
    label: 'Aktuálne zamestnanie *',
    type: 'text',
    component: 'input',
    id: 'actualJobInfo',
    validation: ['required']
  },
  {
    label: 'Ďalšie moje projekty a dobrovoľníctvo',
    type: 'editor',
    component: 'editor',
    id: 'otherActivities',
    validation: []
  },
];

class CustomForm extends React.Component {
  constructor(props) {
    super(props);

    const stateValues = {};

    props.formItems.forEach((item) => {
      if (item.component === 'date') {
          stateChange[item.id] = parse(item.value);
      } else if (item.component === 'editor') {
          stateChange[item.id] = stateFromHTML(item.value);
      } else {
          stateChange[item.id] = item.value;
      }
      stateValues[`${item.id}Errors`] = null;
    });

    this.state = stateValues;
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
          if (!value.trim().length) {
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

      this.setState({ updating: false });
    } else {
      actions.setNotification({
        id: 'updateForm',
        place: 'tr',
        color: 'danger',
        message: 'Prosím najskôr opravte zvýraznené chyby'
      });
      this.setState({ updating: false });
    }
    this.setState({ updating: false });
  }

  render() {
    const {
      classes,
      formItems,
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
              <ItemGrid xs={12}>
                <Button color="nexteriaOrange" onClick={this.update}>
                {this.state.updating === true ? (
                  <Spinner
                    name="line-scale-pulse-out"
                    fadeIn="none"
                    className={classes.buttonSpinner}
                    color="#fff"
                  />
                ) : (
                  'Aktualizovať'
                  )}
                </Button>
              </ItemGrid>
              </GridContainer>
          </form>
        </ItemGrid>
      </GridContainer>
    );
  }
}

withStyles(profileStyle)(CustomForm)
