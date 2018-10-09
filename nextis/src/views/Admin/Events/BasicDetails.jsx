import React from 'react';

// core components
import ItemGrid from 'components/Grid/ItemGrid';

import { eventTypes } from 'common/constants';
import GridContainer from 'components/Grid/GridContainer';
import FormLabel from '@material-ui/core/FormLabel';


class BasicDetails extends React.Component {
  render() {
    const { event } = this.props;
    console.log(event)

    const formItems = [
      {
        label: 'Aktiviy body',
        type: 'number',
        component: 'input',
        id: 'activityPoints',
        validation: ['required', 'number'],
        disabled: true,
        value: event.activityPoints
      },
      {
        label: 'Typ eventu',
        type: 'text',
        component: 'select',
        id: 'eventType',
        validation: ['required'],
        options: eventTypes,
        disabled: true,
        value: event.type
      },
      {
        label: 'Povinný event',
        type: 'checkbox',
        component: 'checkbox',
        id: 'requiredAttendance',
        validation: [],
        disabled: true,
        value: event.mandatoryParticipation,
      },
      {
        label: 'Level',
        type: 'text',
        component: 'select',
        id: 'eventLevel',
        validation: [],
        value: event.curriculumLevelId,
        disabled: true,
        options: [],
      },
      {
        label: 'Semester',
        type: 'text',
        component: 'select',
        id: 'eventSemester',
        validation: ['required'],
        value: event.semesterId,
        options: [],
        disabled: true,
      },
      {
        label: 'Krátky popis',
        type: 'editor',
        component: 'editor',
        id: 'shortDescription',
        validation: ['required', 'medium-text'],
        disabled: true,
        value: event.shortDescription,
      },
      {
        label: 'Detailný popis',
        type: 'editor',
        component: 'editor',
        id: 'description',
        validation: [],
        disabled: true,
        value: event.description
        ,
      },
    ];

    const classes = {};

    return (
      <GridContainer>
        <ItemGrid xs={12}>
          <ItemGrid xs={12} sm={2} className={classes.labelRow}>
            <FormLabel>
              Aktivity body:
            </FormLabel>
          </ItemGrid>
          <ItemGrid xs={12} sm={10} className={classes.inputRow}>
            {event.activityPoints}
          </ItemGrid>
        </ItemGrid>

        <ItemGrid xs={12}>
          <ItemGrid xs={12} sm={2} className={classes.labelRow}>
            <FormLabel>
              Typ:
            </FormLabel>
          </ItemGrid>
          <ItemGrid xs={12} sm={10} className={classes.inputRow}>
            {eventTypes.find(item => item.value === event.eventType).name}
          </ItemGrid>
        </ItemGrid>

        <ItemGrid xs={12}>
          <ItemGrid xs={12} sm={2} className={classes.labelRow}>
            <FormLabel>
              Krátky popis:
            </FormLabel>
          </ItemGrid>
          <ItemGrid xs={12} sm={10} className={classes.inputRow}>
            <p dangerouslySetInnerHTML={{__html: event.shortDescription}} />
          </ItemGrid>
        </ItemGrid>

        <ItemGrid xs={12}>
          <ItemGrid xs={12} sm={2} className={classes.labelRow}>
            <FormLabel>
              Detailný popis:
            </FormLabel>
          </ItemGrid>
          <ItemGrid xs={12} sm={10} className={classes.inputRow}>
            <p dangerouslySetInnerHTML={{__html: event.description}} />
          </ItemGrid>
        </ItemGrid>

        <ItemGrid xs={12}>
          <ItemGrid xs={12} sm={2} className={classes.labelRow}>
            <FormLabel>
              Semester:
            </FormLabel>
          </ItemGrid>
          <ItemGrid xs={12} sm={10} className={classes.inputRow}>
            {event.semester && event.semester.name}
          </ItemGrid>
        </ItemGrid>

        <ItemGrid xs={12}>
          <ItemGrid xs={12} sm={2} className={classes.labelRow}>
            <FormLabel>
              Level:
            </FormLabel>
          </ItemGrid>
          <ItemGrid xs={12} sm={10} className={classes.inputRow}>
            {event.curriculumLevel && event.curriculumLevel.name}
          </ItemGrid>
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default BasicDetails;
