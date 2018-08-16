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
import Checkbox from 'material-ui/Checkbox';
import format from 'date-fns/format';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
import FormControl from 'material-ui/Form/FormControl';

// @material-ui/icons
import Check from '@material-ui/icons/Check';


// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import HeaderCard from 'components/Cards/HeaderCard';
import Button from 'components/CustomButtons/Button';
import CustomInput from 'components/CustomInput/CustomInput';
import CustomEditor, { stateFromHTML } from 'components/CustomEditor/CustomEditor';
import FormLabel from 'material-ui/Form/FormLabel';
import Chip from 'material-ui/Chip';
import Input from 'material-ui/Input';

import eventFormStyles from 'assets/jss/material-dashboard-pro-react/views/eventFormStyles';
import { eventTypes, eventStatuses } from 'common/constants';

function getLectorName(lector) {
  return `${lector.firstName} ${lector.lastName}`;
}

const formItems = [
  {
    label: 'Názov *',
    type: 'text',
    component: 'input',
    id: 'eventName',
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
    id: 'requiredAttendance',
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
    id: 'eventLevel',
    validation: ['required'],
    defaultValue: [],
  },
  {
    label: 'Semester *',
    type: 'text',
    component: 'input',
    id: 'eventSemester',
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
    id: 'eventStatus',
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
          if ((value.trim && !value.trim().length) || !value.length) {
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

    const {
      nameErrors,
      activityPointsErrors,
      eventName,
      eventType,
      eventTypeErrors,
      activityPoints,
      eventSemester,
      eventSemesterErrors,
      eventLevel,
      eventLevelErrors,
      shortDescription,
      shortDescriptionErrors,
      description,
      descriptionErrors,
      eventStatus,
      eventStatusErrors,
      requiredAttendanceErrors,
      requiredAttendance,
      lectors,
    } = this.state;

    return (
      <GridContainer>
        <ItemGrid xs={12}>
          <HeaderCard
            cardTitle="Nový event"
            headerColor="orange"
            content={(
              <form key={1} className={classes.profileForm}>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal} ${nameErrors && nameErrors.length ? classes.labelErrorContainer : ''}`}
                    >
                      {'Názov eventu *'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <CustomInput
                      success={!nameErrors || nameErrors.length === 0}
                      error={nameErrors && nameErrors.length > 0}
                      id="eventName"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.change(
                          event.target.value,
                          'eventName',
                          'text',
                          ['required'],
                        ),
                        type: 'text',
                        underline: classes.underline,
                        value: eventName
                      }}
                    />
                  </ItemGrid>
                </GridContainer>


                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal} ${activityPointsErrors && activityPointsErrors.length ? classes.labelErrorContainer : ''}`}
                    >
                      {'Aktivity body *'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={4}>
                    <CustomInput
                      success={!activityPointsErrors || activityPointsErrors.length === 0}
                      error={activityPointsErrors && activityPointsErrors.length > 0}
                      id="activityPoints"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        onChange: event => this.change(
                          event.target.value,
                          'activityPoints',
                          'number',
                          ['required', 'number'],
                        ),
                        type: 'number',
                        underline: classes.underline,
                        value: activityPoints
                      }}
                    />
                  </ItemGrid>

                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal} ${eventTypeErrors && eventTypeErrors.length ? classes.labelErrorContainer : ''}`}
                    >
                      {'Typ eventu *'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={4}>
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
                        value={eventType}
                        onChange={event => this.change(
                          event.target.value,
                          'eventType',
                          'text',
                          ['required']
                        )}
                        inputProps={{
                          name: 'eventType',
                          id: 'eventType',
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
                        {eventTypes.map(choice => (
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
                  </ItemGrid>
                </GridContainer>


                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal} ${eventSemesterErrors && eventSemesterErrors.length ? classes.labelErrorContainer : ''}`}
                    >
                      {'Semester *'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={4}>
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
                        value={eventSemester}
                        onChange={event => this.change(
                          event.target.value,
                          'eventSemester',
                          'text',
                          ['required']
                        )}
                        inputProps={{
                          name: 'eventSemester',
                          id: 'eventSemester',
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
                        {[...data.semesters].sort((a, b) => a.name.localeCompare(b.name)).map(semester => (
                          <MenuItem
                            key={semester.id}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                            value={semester.id}
                          >
                            {semester.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ItemGrid>

                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal} ${eventLevelErrors && eventLevelErrors.length ? classes.labelErrorContainer : ''}`}
                    >
                      {'Level *'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={4}>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <Select
                        multiple
                        value={eventLevel || []}
                        onChange={event => this.change(
                          event.target.value,
                          'eventLevel',
                          'text',
                          ['required']
                        )}
                        inputProps={{
                          name: 'eventLevel',
                          id: 'eventLevel',
                        }}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={selected => (
                          <div className={classes.chips}>
                            {selected.map(value => (
                              <Chip key={value} label={data.studentLevels.filter(level => level.id === value)[0].name} className={classes.chip} />
                            ))}
                          </div>
                        )}
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
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
                        {[...data.studentLevels].sort((a, b) => a.name.localeCompare(b.name)).map(level => (
                          <MenuItem
                            key={level.id}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                            value={level.id}
                          >
                            {level.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ItemGrid>
                </GridContainer>

                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal}`}
                    >
                      {'Dotazník pred prihlásením'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10} />
                </GridContainer>

                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal}`}
                    >
                      {'Lektory'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <Select
                        multiple
                        value={lectors || []}
                        onChange={event => this.change(
                          event.target.value,
                          'lectors',
                          'text',
                          []
                        )}
                        inputProps={{
                          name: 'lectors',
                          id: 'lectors',
                        }}
                        input={<Input id="select-multiple-lectors" />}
                        renderValue={selected => (
                          <div className={classes.chips}>
                            {selected.map(value => (
                              <Chip
                                key={value}
                                label={getLectorName(data.lectors.filter(lector => lector.id === value)[0])}
                                className={classes.chip}
                              />
                            ))}
                          </div>
                        )}
                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
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
                        {[...data.lectors].sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)).map(lector => (
                          <MenuItem
                            key={lector.id}
                            classes={{
                              root: classes.selectMenuItem
                            }}
                            value={lector.id}
                          >
                            {`${lector.firstName} ${lector.lastName}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ItemGrid>
                </GridContainer>

                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal}`}
                    >
                      {'Termíny *'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10} />
                </GridContainer>

                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal}`}
                    >
                      {'Účastníci *'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10} />
                </GridContainer>


                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal} ${shortDescriptionErrors && shortDescriptionErrors.length ? classes.labelErrorContainer : ''}`}
                    >
                      {'Krátky popis *'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <CustomEditor
                      className={classes.textEditor}
                      toolbarClassName={classes.textEditorToolbar}
                      editorState={shortDescription}
                      onChange={state => this.change(
                        state,
                        'shortDescription',
                        'text',
                        ['required']
                      )}
                    />
                  </ItemGrid>
                </GridContainer>

                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal} ${shortDescriptionErrors && shortDescriptionErrors.length ? classes.labelErrorContainer : ''}`}
                    >
                      {'Detailný popis'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <CustomEditor
                      className={classes.textEditor}
                      toolbarClassName={classes.textEditorToolbar}
                      editorState={description}
                      onChange={state => this.change(
                        state,
                        'description',
                        'text',
                        []
                      )}
                    />
                  </ItemGrid>
                </GridContainer>

                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal} ${requiredAttendanceErrors && requiredAttendanceErrors.length ? classes.labelErrorContainer : ''}`}
                    >
                      {'Povinná účasť'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={4} alignItems="center" container>
                    <Checkbox
                      tabIndex={-1}
                      onClick={() => this.change(
                        !requiredAttendance,
                        'requiredAttendance',
                        'text',
                        []
                      )}
                      checkedIcon={
                        <Check className={classes.checkedIcon} />
                      }
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: classes.checked
                      }}
                      checked={requiredAttendance}
                    />
                  </ItemGrid>

                  <ItemGrid xs={12} sm={2}>
                    <FormLabel
                      className={`${classes.labelHorizontal} ${eventStatusErrors && eventStatusErrors.length ? classes.labelErrorContainer : ''}`}
                    >
                      {'Status *'}
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={4}>
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
                        value={eventStatus}
                        onChange={event => this.change(
                          event.target.value,
                          'eventStatus',
                          'text',
                          ['required']
                        )}
                        inputProps={{
                          name: 'eventStatus',
                          id: 'eventStatus',
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
                        {eventStatuses.map(choice => (
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
                  </ItemGrid>
                </GridContainer>
              </form>
            )}
            footer={(
              <Button color="success" onClick={this.typeClick}>
                Vytvoriť
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
query FetchEvents ($roles: [String!]){
  events{
    id
    name
    status
    eventType
  }
  semesters {
    id
    name
  }
  studentLevels {
    id
    name
  }
  lectors: users (roles: $roles) {
    id
    firstName
    lastName
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
          roles: ['LECTOR'],
        },
      };
    }
  }),
)(NewEventForm);
