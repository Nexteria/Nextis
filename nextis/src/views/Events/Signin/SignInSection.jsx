import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { connect } from 'common/store';
import { compose } from 'recompose';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import isAfter from 'date-fns/is_after';
import Spinner from 'react-spinkit';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';

// material-ui icons
import Info from '@material-ui/icons/Info';
import ExposurePlus2 from '@material-ui/icons/ExposurePlus2';
import CallSplit from '@material-ui/icons/CallSplit';
import EventIcon from '@material-ui/icons/Event';
import Assignment from '@material-ui/icons/Assignment';

// core components
import ItemGrid from 'components/Grid/ItemGrid';
import RegularCard from 'components/Cards/RegularCard';
import Button from 'components/CustomButtons/Button';
import Table from 'components/Table/Table';

import { meetingsQuery, standInSignAction, eventSignAction } from 'views/Events/Signin/Queries';

import eventActionsStyle from 'assets/jss/material-dashboard-pro-react/views/eventActionsStyle';

class SignInSection extends React.Component {
  constructor(props) {
    super(props);

    this.handleStandinAction = this.handleStandinAction.bind(this);
    this.handleWontGoAction = this.handleWontGoAction.bind(this);
  }

  isEventFull(event) {
    return (
      event.canStudentSignIn.codename === 'group_max_capacity_reached' ||
      event.canStudentSignIn.codename === 'term_max_capacity_reached'
    );
  }

  async handleStandinAction(studentId, eventId, action) {
    await this.props.standInSignAction({ variables: {studentId, eventId, action} })
    this.props.data.refetch();
  }

  async handleWontGoAction(event) {
    const { signAction, student, data } = this.props;

    await signAction({
      variables: {
        studentId: student.id,
        eventId: event.id,
        action: 'WONT_GO',
        terms: [event.terms[0].id],
        reason: '',
      }
    });

    data.refetch();
  }

  transformEvent(event, classes, history, studentId) {
    let terms = [...event.terms];
    terms = terms.sort((a, b) => {
      return a.eventStartDateTime.localeCompare(b.eventStartDateTime);
    });

    const startDateTimeString = format(parse(terms[0].eventStartDateTime), 'DD.MM.YYYY o HH:mm');
    const endDateTimeString = format(parse(terms[terms.length - 1].eventEndDateTime), 'DD.MM.YYYY o HH:mm');

    const attendee = event.attendees[0];
    const deadline = format(parse(attendee.signInCloseDateTime), 'DD.MM.YYYY o HH:mm');

    let fillButtons = [
      { color: 'info', icon: Info, action: () => history.push(`/events/${event.id}`) },
    ];

    if (!this.isEventFull(event)) {
      fillButtons.push({
        color: 'success',
        icon: event.form ? Assignment : null,
        text: ' Prihlásiť',
        action: () => history.push(`/events/${event.id}/signIn`)
      })
    } else if (!attendee.standIn) {
      fillButtons.push({
        color: 'warning',
        text: 'Prihlásiť ako náhradník',
        action: () => history.push(`/events/${event.id}/signIn`)
      })
    }

    if (attendee.standIn) {
      fillButtons.push({ color: 'danger', text: 'Odhlásiť z náhradníkov', action: () => this.handleStandinAction(studentId, event.id, 'SIGN_OUT') })
    }

    if (!attendee.wontGo && !attendee.signedOut) {
      fillButtons.push({
        color: 'danger',
        text: 'Nezúčastním sa',
        action: () => this.handleWontGoAction(event)
      });
    }

    fillButtons = fillButtons.map((prop, key) => (
      <Button color={prop.color} customClass={classes.actionButton} key={key} onClick={prop.action}>
        {prop.icon ? <prop.icon className={classes.icon} /> : null}
        {prop.text ? prop.text : null}
      </Button>
    ));

    const parentTerms = {};
    let rootTerms = 0;
    [...event.terms].forEach((term) => {
      if (term.parentTermId) {
        parentTerms[term.parentTermId] = true;
      } else {
        rootTerms += 1;
      }
    });

    const hasAlternatives = rootTerms > 1;
    const hasEventChoices = event.groupedEvents.length || (event.parentEvent && event.parentEvent.id);
    const isMultiMeeting = Object.keys(parentTerms).length >= 1;

    return {
      data: [
        event.name,
        <div>
          {isMultiMeeting ?
            <Button disabled customClass={classes.eventTypeButton}>
              <ExposurePlus2 className={classes.eventTypeIcon} />
            </Button>
            : null
          }
          {hasAlternatives ? 
          <Button disabled customClass={classes.eventTypeButton}>
            <EventIcon className={classes.eventTypeIcon} />
          </Button>
            : null
          }
          {hasEventChoices ? 
          <Button disabled customClass={classes.eventTypeButton}>
            <CallSplit className={classes.eventTypeIcon} />
          </Button>
            : null
          }
        </div>,
        <div>
          <div>{startDateTimeString}</div>
          <div>{endDateTimeString}</div>
        </div>,
        deadline,
        fillButtons
      ],
      shaded: attendee.signedOut || attendee.wontGo,
    };
  }

  render() {
    const { classes, history, data } = this.props;
    
    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const student = data.student;

    const openEventsForSignin = student ? student.openEventsForSignin.filter(event =>
      !event.attendees[0].signedIn
    ) : [];

    let events = openEventsForSignin.filter(event =>
      event.canStudentSignIn.canSignIn === true ||
      this.isEventFull(event)
    ).map(event => this.transformEvent(event, classes, history, student.id));
    events.sort((a, b) => isAfter(a.startDateTime, b.startDateTime) ? -1 : 1);

    return (
      <div>
        <ItemGrid xs={12}>
          <label>Legenda</label>
        </ItemGrid>
        <ItemGrid xs={12}>
          <Button disabled customClass={classes.eventTypeButton + " " + classes.legendButton}>
            <ExposurePlus2 className={classes.eventTypeIcon} />
            <div className={classes.indicatorButtonText}>Viacdielny</div>
          </Button>
          <Button disabled customClass={classes.eventTypeButton + " " + classes.legendButton}>
            <EventIcon className={classes.eventTypeIcon} />
            <div className={classes.indicatorButtonText}>Vyber si termín</div>
          </Button>
          <Button disabled customClass={classes.eventTypeButton + " " + classes.legendButton}>
            <CallSplit className={classes.eventTypeIcon} />
            <div className={classes.indicatorButtonText}>Alternatíva</div>
          </Button>
        </ItemGrid>

        <ItemGrid xs={12}>
          <RegularCard
            customCardClasses={classes.noTopMarginCard}
            content={
              events.length ?
                <Table
                  tableHead={[
                    "Názov eventu",
                    "",
                    "Trvanie",
                    "Deadline na prihlásenie",
                    "Akcie"
                  ]}
                  tableData={[...events]}
                  customCellClasses={[
                    classes.left,
                    classes.right + " " + classes.centerMobile,
                    classes.center,
                    classes.center,
                    classes.left,
                  ]}
                  customClassesForCells={[0, 1, 2, 3]}
                  customHeadCellClasses={[
                    classes.left,
                    classes.right + " " + classes.centerMobile,
                    classes.center + " " + classes.durationField,
                    classes.center,
                    classes.center + " " + classes.actionButtons,
                  ]}
                  customHeadClassesForCells={[0, 1, 2, 3]}
                />
                :
                <h4 className={classes.center}>Momentálne pre Teba nie je otvorené žiadne prihlasovanie!</h4>
            }
          />
        </ItemGrid>
      </div>
    );
  }
}



export default compose(
  connect(state => ({ user: state.user, student: state.student })),
  withStyles(eventActionsStyle),
  graphql(standInSignAction, { name: 'standInSignAction' }),
  graphql(eventSignAction, { name: 'signAction' }),
  graphql(meetingsQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.student.id,
        userId: props.user.id,
      },
    })
  }),
  withRouter,
)(SignInSection);
