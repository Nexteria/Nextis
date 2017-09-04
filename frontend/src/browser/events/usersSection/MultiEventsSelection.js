import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import isAfter from 'date-fns/is_after';
import { FormattedDate, FormattedTime } from 'react-intl';


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

export default class MultiEventsSelection extends Component {

  static propTypes = {
    nxLocations: PropTypes.object.isRequired,
    groupedEvents: PropTypes.object.isRequired,
    openLocationDetailsDialog: PropTypes.func.isRequired,
    openSignOutDialog: PropTypes.func.isRequired,
    attendeeSignIn: PropTypes.func.isRequired,
    toggleEventTerm: PropTypes.func.isRequired,
    viewerId: PropTypes.number.isRequired,
  }

  render() {
    const {
      groupedEvents,
      openLocationDetailsDialog,
      nxLocations,
      openSignOutDialog,
      attendeeSignIn,
      toggleEventTerm,
      viewerId,
    } = this.props;

    const choosedEvents = groupedEvents.filter(event => event.getIn(['viewer', 'attendee', 'signedIn']));

    return (
      <div>
        {choosedEvents.map(event =>
          <table style={styles.container}>
            <thead className="text-center" style={styles.eventName}>
              <tr>
                <td style={styles.rowsCells} colSpan="5"><b>{event.name}</b></td>
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
              {event.getIn(['terms', 'streams']).first().get('terms')
                .merge(event.getIn(['terms', 'streams']))
                .sort((a, b) =>
                  isAfter(a.get('eventStartDateTime'), b.get('eventStartDateTime')) ? 1 : -1
                )
                .valueSeq()
                .map((term, i) => {
                  const nxLocation = nxLocations.get(term.get('nxLocationId'));

                  return (
                    <tr>
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
                        {term.getIn(['attendee', 'signedIn']) &&
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={() => openSignOutDialog(event, 'SIGN_OUT', term.get('id'))}
                          >
                            Odhlásiť
                          </button>
                        }
                        {term.getIn(['attendee', 'signedOut']) &&
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
                })}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
