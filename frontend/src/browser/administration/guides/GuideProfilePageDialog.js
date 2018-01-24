import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import Modal, { Body } from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import GuideProfilePage from './GuideProfilePage';


import './GuideProfile.scss';


export class GuideProfilePageDialog extends Component {

  static propTypes = {
    guides: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  render() {
    const {
      guides,
      fields,
      params,
    } = this.props;

    const guide = guides.get(parseInt(params.guideId, 10));

    if (!guide) {
      return null;
    }

    return (
      <Modal
        show
        bsSize="large"
        onHide={() => browserHistory.goBack()}
        className="guides-container"
      >
        <Body>
          <GuideProfilePage guide={guide} fields={fields} />
        </Body>
      </Modal>
    );
  }
}

export default connect(state => ({
  guides: state.guides.guides,
  fields: state.guides.fields,
}))(GuideProfilePageDialog);
