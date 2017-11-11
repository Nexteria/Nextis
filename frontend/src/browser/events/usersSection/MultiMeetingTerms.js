import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import isAfter from 'date-fns/is_after';
import { FormattedDate, FormattedTime } from 'react-intl';
import isBefore from 'date-fns/is_before';
import parse from 'date-fns/parse';

const styles = {
  container: {
    marginRight: '32px',
    float: 'right',
    backgroundColor: '#fff',
    border: '1px solid #000',
  },
  eventName: {
    backgroundColor: '#ccc',
  },
  rowsCells: {
    paddingTop: '2px',
    paddingBottom: '2px',
  },
};

export default class MultiMeetingTerms extends Component {

  static propTypes = {
    choosedStream: PropTypes.object.isRequired,
    openLocationDetailsDialog: PropTypes.func.isRequired,
    openSignOutDialog: PropTypes.func.isRequired,
    toggleEventTerm: PropTypes.func.isRequired,
    attendeeSignIn: PropTypes.func.isRequired,
    viewerId: PropTypes.number.isRequired,
    nxLocations: PropTypes.object.isRequired,
    event: PropTypes.object,
  }

  render() {
    const {
      choosedStream,
      openLocationDetailsDialog,
      openSignOutDialog,
      toggleEventTerm,
      attendeeSignIn,
      viewerId,
      event,
      nxLocations,
    } = this.props;

    return (
      <div>
        <table style={styles.container}>
          <thead className="text-center" style={styles.eventName}>
            <tr>
              <td style={styles.rowsCells} colSpan="5"><b>Tvoje stretnutia</b></td>
            </tr>
            <tr>
              <td style={styles.rowsCells}>#</td>
              <td style={styles.rowsCells}>od</td>
              <td style={styles.rowsCells}>do</td>
              <td style={styles.rowsCells}>miesto</td>
              <td style={styles.rowsCells}>účasť</td>
            </tr>
          </thead>
          <tbody>
            {choosedStream.get('terms')
              .merge(new Map([[choosedStream.get('id'), choosedStream]]))
              .sort((a, b) =>
                isAfter(a.get('eventStartDateTime'), b.get('eventStartDateTime')) ? 1 : -1
              )
              .valueSeq()
              .map((term, i) => {
                const nxLocation = nxLocations.get(term.get('nxLocationId'));

                const now = parse(new Date());
                const isBeforeTerm = isBefore(now, term.get('eventStartDateTime'));

                return (
                  <tr key={i}>
                    <td style={styles.rowsCells}>{i + 1}</td>
                    <td style={styles.rowsCells}>
                      <span>
                        <FormattedDate value={term.get('eventStartDateTime')} />
                        <span> o </span>
                        <FormattedTime value={term.get('eventStartDateTime')} />
                      </span>
                    </td>
                    <td style={styles.rowsCells}>
                      <span>
                        <FormattedDate value={term.get('eventEndDateTime')} />
                        <span> o </span>
                        <FormattedTime value={term.get('eventEndDateTime')} />
                      </span>
                    </td>
                    <td style={styles.rowsCells}><a onClick={() => openLocationDetailsDialog(nxLocation.id)}>{nxLocation.name}</a></td>
                    <td style={styles.rowsCells}>
                      {term.getIn(['attendee', 'signedIn']) && isBeforeTerm &&
                        <button
                          className="btn btn-danger btn-xs"
                          onClick={() => openSignOutDialog(event, 'SIGN_OUT', term.get('id'))}
                        >
                          Odhlásiť
                        </button>
                      }
                      {term.getIn(['attendee', 'signedOut']) && isBeforeTerm &&
                        <button
                          className="btn btn-success btn-xs"
                          onClick={() => {
                            toggleEventTerm(term.get('id'), event.get('id'), true, true);
                            attendeeSignIn(viewerId);
                          }}
                        >
                          Prihlásiť
                        </button>
                      }
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}
