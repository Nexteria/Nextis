import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import isWithinRange from 'date-fns/is_within_range';
import isAfter from 'date-fns/is_after';


export default class SignUpDeadlines extends Component {

  static propTypes = {
    attendee: PropTypes.object.isRequired,
  }

  render() {
    const {
      attendee,
    } = this.props;


    if (!attendee) {
      return (
        <div className="col-md-12 col-sm-12 col-xs-12 event-actions-notes">
          Tento event nie je pre teba dostupný
        </div>
      );
    }

    const signedIn = attendee ? attendee.signedIn : false;

    const now = new Date();
    const isSignInOpen = isWithinRange(
      now,
      attendee.attendeesGroup.signUpOpenDateTime,
      attendee.attendeesGroup.signUpDeadlineDateTime
    );

    const signInExpired = isAfter(now, attendee.attendeesGroup.signUpDeadlineDateTime);

    return (
      <div className="col-md-12 col-sm-12 col-xs-12 event-actions-notes">
        {isSignInOpen &&
          <span>
            <span>Prihlasovanie je otvorené do: </span>
            <span>
              <FormattedDate value={attendee.attendeesGroup.signUpDeadlineDateTime} />
              <span> o </span>
              <FormattedTime value={attendee.attendeesGroup.signUpDeadlineDateTime} />
            </span>
          </span>
        }

        {!signedIn && signInExpired &&
          <span>
            <span>Prihlasovanie bolo možné do: </span>
            <span>
              <FormattedDate value={attendee.attendeesGroup.signUpDeadlineDateTime} />
              <span> o </span>
              <FormattedTime value={attendee.attendeesGroup.signUpDeadlineDateTime} />
            </span>
          </span>
        }

        {!isSignInOpen && !signInExpired &&
          <span>
            <span>Prihlasovanie sa otvára: </span>
            <span>
              <FormattedDate value={attendee.attendeesGroup.signUpOpenDateTime} />
              <span> o </span>
              <FormattedTime value={attendee.attendeesGroup.signUpOpenDateTime} />
            </span>
          </span>
        }
      </div>
    );
  }
}
