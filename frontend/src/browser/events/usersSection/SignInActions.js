import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import SignUpDeadlines from './SignUpDeadlines';
import isWithinRange from 'date-fns/is_within_range';
import isAfter from 'date-fns/is_after';

import FeedbackButton from './Event/FeedbackButton';


export default class SignInActions extends Component {

  static propTypes = {
    attendee: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
  }

  render() {
    const {
      attendee,
      event,
    } = this.props;


    if (!attendee) {
      return (
        <div className="col-md-12 col-sm-12 col-xs-12 event-actions-notes">
          Tento event nie je pre teba dostupný
        </div>
      );
    }

    const signedIn = attendee ? attendee.signedIn : false;
    /* const signedOut = attendee ? attendee.signedOut : false;
    const standIn = attendee ? attendee.standIn : false;
    const wontGo = attendee ? attendee.wontGo : false;
    const wasPresent = attendee ? attendee.wasPresent : false;
    const filledFeedback = attendee ? attendee.filledFeedback : false;

    let canSignIn = false;
    let canNotSignInReasons = new Map();
    const streams = event.terms.filter(term => !term.parentTermId);
    streams.forEach(term => {
      if (!term.canNotSignInReason) {
        canSignIn = true;
      } else {
        canNotSignInReasons = canNotSignInReasons.set(term.canNotSignInReason, true);
      }
    });

    const capacityLimitReached =
      canNotSignInReasons.has('group_max_capacity_reached') || canNotSignInReasons.has('term_max_capacity_reached'); */

    const now = new Date();
    const isSignInOpen = isWithinRange(
      now,
      attendee.attendeesGroup.signUpOpenDateTime,
      attendee.attendeesGroup.signUpDeadlineDateTime
    );

    const signInExpired = isAfter(now, attendee.attendeesGroup.signUpDeadlineDateTime);

    return (
      // questionForm
      // multiterms
      // multi stretko
      // obsadene
      // choose option
      // nahradnici

      <div>
        <SignUpDeadlines attendee={attendee} />

        {attendee.wasPresent && !attendee.filledFeedback &&
          <FeedbackButton publicFeedbackLink={event.publicFeedbackLink} />
        }

        {/* <div className="event-actions col-md-12 col-sm-12 col-xs-12">
          
          {!signedIn && isSignInOpen && canSignIn &&
            <button
              className="btn btn-success btn-xs"
              onClick={() => {
                if (isMultiTerm) {
                  change('chooseStreamEventId', event.id);
                } else {
                  toggleEventTerm(streams[0].id, event.id);
                  if (event.form) {
                    browserHistory.push({
                      pathname: `/events/${event.id}/questionnaire`,
                      state: { viewerId: attendee.userId, groupId: attendee.attendeesGroup.id }
                    });
                  } else {
                    if (groupedEvents.size) {
                      browserHistory.push(`/events/${event.id}/login`);
                    } else {
                      attendeeSignIn(attendee.userId);
                    }
                  }
                }
              }}
            >
              {event.form ? <span style={{ marginRight: '0.5em' }}><i className="fa fa-file-text-o"></i></span> : null}
              Záväzne sa prihlasujem {isMultiTerm ? '- vybrať termín' : ''}
            </button>
          }
          {signedIn && isBeforeEvent &&
            <button
              className="btn btn-danger btn-xs"
              onClick={() => openSignOutDialog(event, 'SIGN_OUT')}
            >
              Odhlásiť
            </button>
          }
          {!signedIn && !signedOut && !wontGo && isSignInOpen &&
            <button
              className="btn btn-danger btn-xs"
              onClick={() => {
                toggleEventTerm(streams[0].id, event.id);
                if (event.mandatoryParticipation) {
                  openSignOutDialog(event, 'WONT_GO');
                } else {
                  attendeeWontGo(attendee.userId);
                }
              }}
            >
              Nezúčastním sa
            </button>
          }
          {!signedIn && isSignInOpen && capacityLimitReached &&
            <button
              className="btn btn-info btn-xs"
              onClick={() => {
                toggleEventTerm(streams[0].id, event.id);
                signAsStandIn(attendee.userId);
              }}
            >
              Prihlásiť ako náhradník
            </button>
          }
          {standIn && isSignInOpen &&
            <button
              className="btn btn-warning btn-xs"
              onClick={() => {
                toggleEventTerm(streams[0].id, event.id);
                signOutAsStandIn(attendee.userId);
              }}
            >
              Odhlásiť z náhradníkov
            </button>
          }
        </div> */}
      </div>
    );
  }
}
