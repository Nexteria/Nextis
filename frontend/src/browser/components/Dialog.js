import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import Modal, { Body } from 'react-bootstrap/lib/Modal';

export default class Dialog extends Component {

  static propTypes = {
    children: PropTypes.object,
  }

  render() {
    const { children } = this.props;

    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="event-details-dialog"
        onHide={null}
      >
        <Body>
          {children}
        </Body>
      </Modal>
    );
  }
}
