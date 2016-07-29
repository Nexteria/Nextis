import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import EditEvent from './EditEvent';
import * as actions from '../../common/events/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Create event',
    id: 'events.create.title'
  },
});

export class CreateEventPage extends Component {

  static propTypes = {
    saveEvent: PropTypes.func.isRequired,
  }

  render() {
    const { saveEvent } = this.props;

    return (
      <div>
        <EditEvent
          mode="create"
          title={<FormattedMessage {...messages.title} />}
          saveEvent={saveEvent}
        />
      </div>
    );
  }
}

CreateEventPage = injectIntl(CreateEventPage);

export default connect(() => ({
}), actions)(CreateEventPage);
