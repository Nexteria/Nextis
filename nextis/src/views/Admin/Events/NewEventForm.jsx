import React from 'react';

// material-ui components
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'common/store';
import Spinner from 'react-spinkit';
import { withRouter } from 'react-router-dom';

// core components
import GridContainer from 'components/Grid/GridContainer';
import ItemGrid from 'components/Grid/ItemGrid';
import HeaderCard from 'components/Cards/HeaderCard';
import CustomForm from 'views/Forms/CustomForm';

import eventFormStyles from 'assets/jss/material-dashboard-pro-react/views/eventFormStyles';
import { eventTypes, eventStatuses } from 'common/constants';


let formItems = [
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
    options: eventTypes,
  },
  {
    label: 'Povinný event',
    type: 'checkbox',
    component: 'checkbox',
    id: 'requiredAttendance',
    validation: []
  },
  {
    label: 'Level *',
    type: 'text',
    component: 'select',
    id: 'eventLevel',
    validation: [],
    value: '-',
  },
  {
    label: 'Semester *',
    type: 'text',
    component: 'select',
    id: 'eventSemester',
    validation: ['required']
  },
  {
    label: 'Krátky popis *',
    type: 'editor',
    component: 'editor',
    id: 'shortDescription',
    validation: ['required', 'medium-text']
  },
  {
    label: 'Detailný popis',
    type: 'editor',
    component: 'editor',
    id: 'description',
    validation: []
  },
  {
    label: 'Status *',
    type: 'text',
    component: 'select',
    id: 'eventStatus',
    validation: [],
    value: 'draft',
    disabled: true,
    options: eventStatuses,
  },
];

class NewEventForm extends React.Component {
  constructor(props) {
    super(props);

    this.createEvent = this.createEvent.bind(this);
  }

  createEvent(data) {
    const { createEvent, history, actions } = this.props;

    return createEvent({ variables: {
      name: data.eventName,
      activityPoints: data.activityPoints,
      type: data.eventType,
      mandatoryParticipation: !!data.requiredAttendance,
      curriculumLevelId: data.eventLevel === '-' ? null : data.eventLevel,
      semesterId: data.eventSemester,
      shortDescription: data.shortDescription,
      description: data.description,
    } }).then(async (response) => {
      history.push(`/admin/events/${response.data.CreateEvent.id}`);

      actions.setNotification({
        id: 'createEvent',
        place: 'tr',
        color: 'success',
        message: 'Event bol vytvorený'
      });
    }).catch((errorData) => {
      const error = errorData.graphQLErrors[0];

      if (error && error.message !== 'validation') {
        actions.setNotification({
          id: 'createEvent',
          place: 'tr',
          color: 'danger',
          message: 'Pri vytváraní eventu došlo k chybe. Skús znova prosím!'
        });
      } else {
        actions.setNotification({
          id: 'createEvent',
          place: 'tr',
          color: 'danger',
          message:
            'Zadané údaje neboli platné. Skontroluj formulár prosím!'
        });
      }
    })
  }

  render() {
    const { data } = this.props;

    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const semesterOptions = data.semesters.map(semester => ({
      value: semester.id,
      name: semester.name
    }));

    const defaultLevelValue = { value: '-', name: 'Pre všetkých'};
    let levelsOptions = data.studentLevels.map(level => ({
      value: level.id,
      name: level.name
    }));
    levelsOptions = [defaultLevelValue, ...levelsOptions];

    formItems = formItems.map(item => {
      if (item.id === 'eventSemester') {
        item.options = semesterOptions;
        item.value = data.activeSemesters[0].id
      }

      if (item.id === 'eventLevel') {
        item.options = levelsOptions;
      }

      return item;
    });

    return (
      <GridContainer>
        <ItemGrid xs={12}>
          <HeaderCard
            cardTitle="Nový event"
            headerColor="orange"
            content={(
              <CustomForm
                formItems={formItems}
                buttonText="Vytvoriť event"
                buttonColor="success"
                buttonAction={this.createEvent}
              />
            )}
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

const dataQuery = gql`
query FetchData {
  semesters {
    id
    name
  }
  studentLevels {
    id
    name
  }
  activeSemesters: semesters (onlyActiveSemester: true) {
    id,
    name,
  }
}
`;

const createEventMutation = gql`
  mutation CreateEvent (
    $name: String!
    $activityPoints: Int!
    $type: String!
    $mandatoryParticipation: Boolean!
    $curriculumLevelId: Int
    $semesterId: Int!
    $shortDescription: String!
    $description: String
  ) {
    CreateEvent(
      name: $name
      activityPoints: $activityPoints
      type: $type
      mandatoryParticipation: $mandatoryParticipation
      curriculumLevelId: $curriculumLevelId
      semesterId: $semesterId
      shortDescription: $shortDescription
      description: $description
    ) {
      id
    }
  }
`;

export default compose(
  withRouter,
  connect(state => ({ user: state.user })),
  withStyles(eventFormStyles),
  graphql(dataQuery, {}),
  graphql(createEventMutation, { name: 'createEvent' }),
)(NewEventForm);
