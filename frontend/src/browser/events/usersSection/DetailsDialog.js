import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';


import * as eventActions from '../../../common/events/actions';

const messages = defineMessages({
  closeButton: {
    defaultMessage: 'Close',
    id: 'event.users.detail.closeButton',
  }
});

export class DetailsDialog extends Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
    closeEventDetailsDialog: PropTypes.func.isRequired,
  }

  render() {
    const { event } = this.props;
    const {
      closeEventDetailsDialog,
    } = this.props;

    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="event-details-dialog"
        onHide={closeEventDetailsDialog}
      >
        <Header closeButton>
          <Title>{event.name}</Title>
        </Header>

        <Body>
          <div dangerouslySetInnerHTML={{ __html: event.description.toString('html') }}></div>
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-primary"
              onClick={closeEventDetailsDialog}
            >
              <FormattedMessage {...messages.closeButton} />
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

export default connect(() => ({}), eventActions)(DetailsDialog);
