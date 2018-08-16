import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import validator from 'validator';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'common/store';
import Spinner from 'react-spinkit';
import { withRouter } from 'react-router-dom';
import Datetime from 'react-datetime';
import format from 'date-fns/format';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
import FormControl from 'material-ui/Form/FormControl';

// @material-ui/icons

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import HeaderCard from 'components/Cards/HeaderCard';
import Button from 'components/CustomButtons/Button';
import CustomInput from 'components/CustomInput/CustomInput';
import CustomEditor, { stateFromHTML } from 'components/CustomEditor/CustomEditor';
import FormLabel from 'material-ui/Form/FormLabel';

import eventFormStyles from 'assets/jss/material-dashboard-pro-react/views/eventFormStyles';
import { eventTypes, eventStatuses } from 'common/constants';

const formItems = [
  {
    label: 'Názov *',
    type: 'text',
    component: 'input',
    id: 'name',
    validation: ['required']
  },
  {
    label: 'Aktiviy body *',
    type: 'number',
    component: 'input',
    id: 'activityPoints',
    validation: ['required', 'number']
  },
  {
    label: 'Typ eventu *',
    type: 'text',
    component: 'select',
    id: 'eventType',
    validation: ['required'],
    choices: eventTypes,
  },
  {
    label: 'Dotazník na prihlasovanie',
    type: 'text',
    component: 'input',
    id: 'questionForm',
    validation: []
  },
  {
    label: 'Lektory',
    type: 'text',
    component: 'input',
    id: 'lectors',
    validation: []
  },
  {
    label: 'Terms *',
    type: 'text',
    component: 'input',
    id: 'terms',
    validation: ['required']
  },
  {
    label: 'Povinný event *',
    type: 'text',
    component: 'input',
    id: 'mandatoryParticipation',
    validation: ['required']
  },
  /* {
    label: 'Grouped Events',
    type: 'text',
    component: 'input',
    id: 'groupedEvents',
    validation: [],
  }, */
  /* {
    label: 'Vylučujúce sa eventy',
    type: 'text',
    component: 'input',
    id: 'exclusionaryEvents',
    validation: [],
  }, */
  {
    label: 'Level *',
    type: 'text',
    component: 'input',
    id: 'curriculumLevelId',
    validation: ['required']
  },
  {
    label: 'Semester *',
    type: 'text',
    component: 'input',
    id: 'semester',
    validation: ['required']
  },
  {
    label: 'Účastníci *',
    type: 'text',
    component: 'input',
    id: 'attendeesGroups',
    validation: ['required']
  },
  {
    label: 'Krátky popis *',
    type: 'editor',
    component: 'editor',
    id: 'shortDescription',
    validation: ['required']
  },
  {
    label: 'Detailný popis *',
    type: 'editor',
    component: 'editor',
    id: 'description',
    validation: ['required']
  },
  {
    label: 'Status *',
    type: 'text',
    component: 'select',
    id: 'status',
    validation: [],
    choices: eventStatuses,
  },
];

class NewEventForm extends React.Component {
  constructor(props) {
    super(props);

    const stateValues = {};

    formItems.forEach((item) => {
      if (item.component === 'editor') {
        stateValues[item.id] = stateFromHTML('');
        stateValues[`${item.id}Errors`] = null;
      } else {
        stateValues[item.id] = '';
        stateValues[`${item.id}Errors`] = null;
      }
    });
    this.state = stateValues;

    this.change = this.change.bind(this);
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

    this.setState({ [stateName]: value });
  }

  render() {
    const { data, classes } = this.props;

    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    return (
      <GridContainer>
        <ItemGrid xs={12}>
          <HeaderCard
            cardTitle="Nový event"
            headerColor="orange"
            content={(
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
              </form>
            )}
            footer={(
              <Button color="rose" onClick={this.typeClick}>
                Validate Inputs
              </Button>
            )}
            footerAlign="center"
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

const eventsQuery = gql`
query FetchEvents{
  events{
    id
    name
    status
    eventType
  }
}
`;

export default compose(
  withRouter,
  connect(state => ({ user: state.user })),
  withStyles(eventFormStyles),
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
)(NewEventForm);
