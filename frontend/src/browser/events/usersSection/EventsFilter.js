import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';

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
      <div className="col-md-12" style={{ textAlign: 'center' }}>
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
