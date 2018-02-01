import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import isAfter from 'date-fns/is_after';
import parse from 'date-fns/parse';

export default class EventsFilter extends Component {

  static propTypes = {
    eventsFilter: PropTypes.string,
    change: PropTypes.func.isRequired,
  };

  render() {
    const {
      eventsFilter,
      change,
    } = this.props;

    return (
      <div className="col-md-12 events-filter" style={{ textAlign: 'center' }}>
        <button
          className={`btn btn-xs events-filter-button ${eventsFilter === 'all' ? 'active' : ''} events-filter-all`}
          onClick={() => change('eventsFilter', 'all')}
        >Všetky</button>
        <button
          className={`btn btn-xs events-filter-button ${eventsFilter === 'onlyForMe' ? 'active' : ''} events-filter-only-for-me`}
          onClick={() => change('eventsFilter', 'onlyForMe')}
        >Pre mňa</button>
        <button
          className={`btn btn-xs events-filter-button ${eventsFilter === 'signedIn' ? 'active' : ''} events-filter-signed-in`}
          onClick={() => change('eventsFilter', 'signedIn')}
        >Prihlásený</button>
        <button
          className={`btn btn-xs events-filter-button ${eventsFilter === 'signedOut' ? 'active' : ''} events-filter-signed-out`}
          onClick={() => change('eventsFilter', 'signedOut')}
        >Odhlásený</button>
        <button
          className={`btn btn-xs events-filter-button ${eventsFilter === 'standIn' ? 'active' : ''} events-filter-stand-in`}
          onClick={() => change('eventsFilter', 'standIn')}
        >Náhradník</button>
      </div>
    );
  }
}

export function filterEvents(events, eventsFilter) {
  return events.filter(event => event.status === 'published' && !event.parentEventId)
    .filter(event => {
      if (eventsFilter === 'all') {
        return true;
      }

      const attendee = event.attendees[0] || null;
      switch (eventsFilter) {
        case 'onlyForMe':
          return attendee;

        case 'signedIn':
          return (attendee && attendee.signedIn);

        case 'signedOut':
          return (attendee && (attendee.signedOut || attendee.wontGo) && !attendee.standIn);

        case 'standIn':
          return (attendee && attendee.standIn);

        default:
          return false;
      }
    }).reduce((reduction, value) => {
      value.terms.forEach(term => {
        const termDate = parse(term.eventStartDateTime);
        if (!term.parentTermId) {
          reduction.push({
            ...value,
            eventStartDateTime: termDate,
            isPrimary: true,
          });
          return;
        }

        if (term.attendees[0] && term.attendees[0].signedIn) {
          reduction.push({
            eventName: value.name,
            eventStartDateTime: termDate,
            isPrimary: false,
          });
        }
      });

      return reduction;
    }, [])
    .sort((a, b) =>
      isAfter(a.eventStartDateTime, b.eventStartDateTime) ? 1 : -1
  );
}
