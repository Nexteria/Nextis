import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { browserHistory } from 'react-router';
import { Map } from 'immutable';


export default class SignInActions extends Component {

  static propTypes = {
    viewer: PropTypes.object.isRequired,
    toggleEventTerm: PropTypes.func.isRequired,
  }

  render() {
    const {
      viewer,
      event,
      isSignInOpen,
      signInExpired,
      isMultiTerm,
      change,
      isBeforeEvent,
      groupedEvents,
      attendeeSignIn,
      attendeeWontGo,
      openSignOutDialog,
      signOutAsStandIn,
      signAsStandIn,
      toggleEventTerm,
    } = this.props;

    const eventViewer = event.get('viewer');

    if (!eventViewer.get('isInvited')) {
      return (
        <div className="col-md-12 col-sm-12 col-xs-12 event-actions-notes">
          Tento event nie je pre teba dostupný
        </div>
      );
    }

    const attendee = eventViewer.has('attendee') ? eventViewer.get('attendee') : null;
    const signedIn = attendee ? attendee.get('signedIn') : false;
    const signedOut = attendee ? attendee.get('signedOut') : false;
    const standIn = attendee ? attendee.get('standIn') : false;
    const wontGo = attendee ? attendee.get('wontGo') : false;
    const wasPresent = attendee ? attendee.get('wasPresent') : false;
    const filledFeedback = attendee ? attendee.get('filledFeedback') : false;

    let canSignIn = false;
    let canNotSignInReasons = new Map();
    event.getIn(['terms', 'streams']).forEach(stream => {
      if (stream.get('canViewerSignIn')) {
        canSignIn = true;
      } else {
        canNotSignInReasons = canNotSignInReasons.set(stream.get('canViewerSignInMessageCodename'), true);
      }
    });

    const capacityLimitReached =
      canNotSignInReasons.has('group_max_capacity_reached') || canNotSignInReasons.has('term_max_capacity_reached');

    return (
      <div>
        <div className="col-md-12 col-sm-12 col-xs-12 event-actions-notes">
          {isSignInOpen &&
            <span>Deadline prihlasovania: <FormattedDate value={eventViewer.get('signUpDeadlineDateTime')} /></span>
          }
          {!signedIn && signInExpired &&
            <span>Prihlasovanie bolo možné do: <FormattedDate value={eventViewer.get('signUpDeadlineDateTime')} /></span>
          }
          {!isSignInOpen && !signInExpired &&
            <span>
              <span>Prihlasovanie sa otvára: </span>
              <span>
                <FormattedDate value={eventViewer.get('signUpOpenDateTime')} />
                <span> o </span>
                <FormattedTime value={eventViewer.get('signUpOpenDateTime')} />
              </span>
            </span>
          }
        </div>

        <div className="event-actions col-md-12 col-sm-12 col-xs-12">
          {signedIn && wasPresent && !filledFeedback &&
            <a
              className="btn btn-info btn-xs"
              target="_blank"
              href={event.publicFeedbackLink}
            >
            Vyplniť feedback
            </a>
          }
          {!signedIn && isSignInOpen && canSignIn &&
            <button
              className="btn btn-success btn-xs"
              onClick={() => {
                if (isMultiTerm) {
                  change('chooseStreamEventId', event.id);
                } else {
                  toggleEventTerm(event.getIn(['terms', 'streams']).first().get('id'), event.id);
                  if (event.has('questionForm') && event.get('questionForm')) {
                    browserHistory.push({
                      pathname: `/events/${event.id}/questionnaire`,
                      state: { viewerId: viewer.id, groupId: viewer.attendeeGroupId }
                    });
                  } else {
                    if (groupedEvents.size) {
                      browserHistory.push(`/events/${event.id}/login`);
                    } else {
                      attendeeSignIn(viewer.get('id'));
                    }
                  }
                }
              }}
            >
              {event.has('questionForm') && event.get('questionForm') ? <span style={{ marginRight: '0.5em' }}><i className="fa fa-file-text-o"></i></span> : null}
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
                toggleEventTerm(event.getIn(['terms', 'streams']).first().get('id'), event.id);
                if (event.mandatoryParticipation) {
                  openSignOutDialog(event, 'WONT_GO');
                } else {
                  attendeeWontGo(viewer.get('id'));
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
                toggleEventTerm(event.getIn(['terms', 'streams']).first().get('id'), event.id);
                signAsStandIn(viewer.get('id'));
              }}
            >
              Prihlásiť ako náhradník
            </button>
          }
          {standIn && isSignInOpen &&
            <button
              className="btn btn-warning btn-xs"
              onClick={() => {
                toggleEventTerm(event.getIn(['terms', 'streams']).first().get('id'), event.id);
                signOutAsStandIn(viewer.get('id'));
              }}
            >
              Odhlásiť z náhradníkov
            </button>
          }
        </div>
      </div>
    );
  }
}
