import React from "react";
import { graphql } from 'react-apollo';
import validator from 'validator';
import Datetime from "react-datetime";
import gql from 'graphql-tag';
import { compose } from 'recompose';
import { connect } from "common/store";
import Spinner from 'react-spinkit';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

// material-ui components
import withStyles from "material-ui/styles/withStyles";


// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import FormLabel from "material-ui/Form/FormLabel";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import Button from "components/CustomButtons/Button.jsx";
import ProfileCard from "components/Cards/ProfileCard.jsx";
import CustomEditor, { stateFromHTML } from "components/CustomEditor/CustomEditor.jsx";

import profileStyle from "assets/jss/material-dashboard-pro-react/views/profileStyle.jsx";
import avatarImg from "assets/img/faces/marc.jpg";

const formItems = [
  {label: 'Meno *', type: 'text', component: 'input', id: 'firstName', validation: ['required']},
  {label: 'Priezvisko *', type: 'text', component: 'input', id: 'lastName', validation: ['required']},
  {label: 'Dátum narodenia *', type: 'date', component: 'date', id: 'dateOfBirth', validation: ['required']},
  {label: 'Niečo o Tebe *', type: 'editor', component: 'editor', id: 'personalDescription', validation: ['required', 'medium-text']},
  {label: 'Email *', type: 'text', component: 'input', id: 'email', validation: ['required', 'email']},
  {label: 'Telefón *', type: 'text', component: 'input', id: 'phone', validation: ['required', 'phone']},
  {label: 'Facebook url', type: 'text', component: 'input', id: 'facebookLink', validation: ['url']},
  {label: 'LinkedIn url', type: 'text', component: 'input', id: 'linkedinLink', validation: ['url']},
  {label: 'Škola *', type: 'text', component: 'input', id: 'school', validation: ['required']},
  {label: 'Fakulta *', type: 'text', component: 'input', id: 'faculty', validation: ['required']},
  {label: 'Štúdijný program *', type: 'text', component: 'input', id: 'studyProgram', validation: ['required']},
  {label: 'Rok štúdia *', type: 'text', component: 'input', id: 'studyYear', validation: ['required']},
  {label: 'Aktuálne zamestnanie *', type: 'text', component: 'input', id: 'actualJobInfo', validation: ['required']},
];

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.updateProfile = this.updateProfile.bind(this);

    let stateValues = {
      isProfileInitialized: false,
    };

    formItems.forEach(item => {
      if (item.component === 'editor') {
        stateValues[item.id] = stateFromHTML("");
        stateValues[`${item.id}Errors`] = null;
      } else {
        stateValues[item.id] = "";
        stateValues[`${item.id}Errors`] = null;
      }
    });
    this.state = stateValues;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isProfileInitialized && nextProps.data.user) {
      const stateChange = {
        isProfileInitialized: true,
      };

      formItems.forEach(item => {
        if (item.component === 'date') {
          stateChange[item.id] = parse(nextProps.data.user[item.id]);
        } else if (item.component === 'editor') {
          stateChange[item.id] = stateFromHTML(nextProps.data.user[item.id]);
        } else {
          stateChange[item.id] = nextProps.data.user[item.id];
        }
      });
      this.setState(stateChange);
    }
  }

  validate(fieldId, component, value, validations) {
    let errors = [];

    if (component === 'editor') {
      value = value.toString('html');
    } else if ( component === 'date') {
      value = format(value, 'DD.MM.YYYY');
    }


    validations.forEach(type => {
      switch (type) {
        case "required":
          if (!value.trim().length) {
            errors.push("Položka je povinná!")
          }
          break;
        case "medium-text":
          if (value.trim().length < 150) {
            errors.push(`Položka musí mať minimálne 150 znakov! (${value.trim().length})`);
          }
          break;
        case "email":
          if (!validator.isEmail(value)) {
            errors.push("Položka musí byť v tvare emailu!")
          }
          break;
        case "number":
          if (!validator.isNumeric(value)) {
            errors.push("Položka musí byť číslo!")
          }
          break;
        case "phone":
          if (!validator.isMobilePhone(value, 'sk-SK')) {
            errors.push("Položka musí telefónne číslo!")
          }
          break;
        case "url":
          if (!validator.isURL(value)) {
            errors.push("Položka musí byť url adresa!")
          }
          break;
        default:
          break;
      }
    });

    this.setState({ [fieldId + "Errors"]: errors });
    return errors.length === 0;
  }

  change(value, stateName, type, validation) {
    this.validate(stateName, type, value, validation);

    // set value
    switch (type) {
      case "checkbox":
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

  updateProfile() {
    this.setState({ updating: true });

    let isFormValid = true;
    let values = {};
    formItems.forEach(item => {
      const result = this.validate(item.id, item.component, this.state[item.id], item.validation);
      if (!result) {
        isFormValid = false;
      }

      if (item.component === 'editor') {
        values[item.id] = this.state[item.id].toString('html');
      } else if (item.component === 'date') {
        values[item.id] = format(this.state[item.id], 'YYYY-MM-DD');
      } else {
        values[item.id] = this.state[item.id];
      }
    });

    if (isFormValid) {
      this.props.updateProfile({ variables: values }).then(() => {
        this.props.actions.setNotification({id: 'updateProfile', place: 'tr', color: 'success', message: 'Profil bol aktualizovaný'});
        this.setState({ updating: false });
      }).catch(data => {
        const error = data.graphQLErrors[0];

        if (error.message !== 'validation') {
          this.props.actions.setNotification({id: 'updateProfile', place: 'tr', color: 'danger', message: 'Pri aktualizovaní došlo k chybe. Skúste znova prosím!'});
        } else {
          this.props.actions.setNotification({id: 'updateProfile', place: 'tr', color: 'danger', message: 'Zadané údaje neboli platné. Skontrolujte formulár prosím!'});

          let errors = {};
          Object.keys(error.validation).forEach(fieldId => {
            errors[`${fieldId}Errors`] = error.validation[fieldId];
          });

          this.setState({ ...errors });
        }

        this.setState({ updating: false });
      });
    } else {
      this.props.actions.setNotification({id: 'updateProfile', place: 'tr', color: 'danger', message: 'Prosím najskôr opravte zvýraznené chyby'});
      this.setState({ updating: false });
    }
  }

  render() {
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const { classes, data } = this.props;

    const avatar = <img src={avatarImg} alt="..." className={classes.img} />;
    const user = data.user;

    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={12} md={10} lg={8}>
          <ProfileCard
            avatar={avatar}
            subtitle={user.actualJobPosition || ""}
            title={`${user.firstName} ${user.lastName}`}
            content={
              <form className={classes.profileForm}>
                {formItems.map(item => {
                  const hasError = this.state[`${item.id}Errors`] && this.state[`${item.id}Errors`].length > 0;
                  const labelAdditionalClass = hasError ? classes.labelErrorContainer : "";
                  return (
                    <GridContainer key={item.id}>
                      <ItemGrid xs={12} sm={2}>
                        <FormLabel className={classes.labelHorizontal + " " + labelAdditionalClass}>
                          {item.label}
                        </FormLabel>
                      </ItemGrid>
                      <ItemGrid xs={12} sm={10}>
                        {item.component === 'input' ?
                          <CustomInput
                            success={this.state[`${item.id}Errors`] && this.state[`${item.id}Errors`].length === 0}
                            error={hasError}
                            id={item.id}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: event =>
                                this.change(event.target.value, item.id, item.type, item.validation),
                              type: item.type,
                              underline: classes.underline,
                              value: this.state[item.id],
                            }}
                          />
                          : null
                        }
                        {item.component === 'date' ?
                          <Datetime
                            timeFormat={false}
                            onChange={value => this.change(value, item.id, item.type, item.validation)}
                            value={this.state[item.id]}
                          />
                          : null
                        }
                        {item.component === 'editor' ?
                          <CustomEditor
                            className={classes.textEditor}
                            toolbarClassName={classes.textEditorToolbar}
                            editorState={this.state[item.id]}
                            onChange={state => this.change(state, item.id, item.type, item.validation)}
                          />
                          : null
                        }
                        {hasError ?
                          <div className={classes.inputErrorContainer}>
                            {this.state[`${item.id}Errors`].map(error => <span key={error}>{error} </span>)}
                          </div>
                          : null
                        }
                      </ItemGrid>
                    </GridContainer>
                  );
                })}
                <GridContainer>
                  <ItemGrid xs={12}>
                    <Button color="nexteriaOrange" onClick={this.updateProfile}>
                      {this.state.updating === true ?
                        <Spinner name='line-scale-pulse-out' fadeIn="none" className={classes.buttonSpinner} color="#fff" />
                        : 'Aktualizovať profil'
                      }
                    </Button>
                  </ItemGrid>
                </GridContainer>
              </form>
            }
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

const UserQuery = gql`
query FetchStudents ($id: Int) {
  user (id: $id){
    id
    firstName
    lastName
    email
    phone
    photo
    facebookLink
    linkedinLink
    actualJobInfo
    school
    faculty
    studyProgram
    dateOfBirth
    personalDescription
    studyYear
  }
}
`;

const userMutation = gql`
  mutation UpdateUserProfile(
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $facebookLink: String!
    $linkedinLink: String!
    $actualJobInfo: String!
    $school: String!
    $faculty: String!
    $studyProgram: String!
    $dateOfBirth: String!
    $personalDescription: String!
    $studyYear: String!
  ) {
    UpdateUserProfile(
      firstName: $firstName
      lastName: $lastName
      email: $email
      phone: $phone
      facebookLink: $facebookLink
      linkedinLink: $linkedinLink
      actualJobInfo: $actualJobInfo
      school: $school
      faculty: $faculty
      studyProgram: $studyProgram
      dateOfBirth: $dateOfBirth
      personalDescription: $personalDescription
      studyYear: $studyYear
    ) {
      id
      firstName
      lastName
      email
      phone
      photo
      facebookLink
      linkedinLink
      actualJobInfo
      school
      faculty
      studyProgram
      dateOfBirth
      personalDescription
      studyYear
    }
  }
`;


export default compose(
  connect(state => ({ userId: state.user.id })),
  withStyles(profileStyle),
  graphql(userMutation, { name: 'updateProfile' }),
  graphql(UserQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.userId,
      },
    })
  }),
)(Profile);