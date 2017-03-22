import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

import * as actions from '../../common/events/actions';
import Events from './Events';
import EventsDefaultSettings from './EventsDefaultSettings';

const messages = defineMessages({
  title: {
    defaultMessage: 'Events',
    id: 'events.manage.title'
  },
  eventsDefaultSettingsTabTitle: {
    defaultMessage: 'Settings',
    id: 'events.manage.eventsDefaultSettingsTabTitle'
  },
  eventsTabTitle: {
    defaultMessage: 'Events',
    id: 'events.manage.eventsTabTitle'
  },
});

class EventsPage extends Component {

  static propTypes = {
    defaultSettings: PropTypes.object,
    fetchDefaultEventsSettings: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchDefaultEventsSettings } = this.props;
    fetchDefaultEventsSettings();
  }

  render() {
    const { defaultSettings } = this.props;

    return (
      <div className="event-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
        </section>
        <section className="content">
          <Tabs defaultActiveKey={1} id="events-tabs" className="nav-tabs-custom">
            <Tab
              eventKey={1}
              title={<i className="fa fa-calendar"> <FormattedMessage {...messages.eventsTabTitle} /></i>}
            >
              <Events />
            </Tab>
            <Tab
              eventKey={2}
              title={<i className="fa fa-gears"> <FormattedMessage {...messages.eventsDefaultSettingsTabTitle} /></i>}
            >
              {defaultSettings ?
                <EventsDefaultSettings /> : null
              }
            </Tab>
          </Tabs>
        </section>
      </div>
    );
  }
}

export default connect(state => ({
  defaultSettings: state.events.defaultSettings,
}), actions)(EventsPage);
