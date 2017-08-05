import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';


import Form from '../../components/Forms/Questionnaire/Form';

import * as eventActions from '../../../common/events/actions';

export class BeforeEventQuestionnaire extends Component {

  static propTypes = {
    actualEvent: PropTypes.object.isRequired,
    closeEventDetailsDialog: PropTypes.func.isRequired,
    params: PropTypes.func.isRequired,
    fetchBeforeEventQuestionnaire: PropTypes.func.isRequired,
    initialized: PropTypes.bool.isRequired,
    attendeeSignIn: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { params, fetchBeforeEventQuestionnaire } = this.props;
    const eventId = params ? params.eventId : null;
    const token = params ? params.token : null;
    fetchBeforeEventQuestionnaire(eventId, token);
  }

  componentWillReceiveProps(nextProps) {
    const { params, actualEvent, initialized, initialize } = nextProps;

    if (params && parseInt(params.eventId, 10) === actualEvent.get('id') && !initialized) {
      initialize({
        formData: actualEvent.getIn(['questionForm', 'formData']),
      });
    }
  }

  renderFormComponent(data) {
    const { input } = data;

    return (
      <Form
        form={input.value}
        onChange={input.onChange}
      />
    );
  }

  render() {
    const {
      initialized,
      location,
      handleSubmit,
      attendeeSignIn,
      actualEvent,
    } = this.props;

    if (!initialized) {
      return <div></div>;
    }

    const { viewer, groupId } = location.state;

    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="event-details-dialog"
        onHide={null}
      >
        <Header style={{ display: 'none' }} />
        <Body>
          <form
            id="beforeEventQuestionnaire"
            onSubmit={handleSubmit((data) => {
              attendeeSignIn(actualEvent.get('id'), viewer, groupId, null, data.formData);
              browserHistory.goBack();
            })}
          >
            <div className="row">
              <Field
                name="formData"
                component={this.renderFormComponent}
              />
            </div>
          </form>
        </Body>

        <Footer>
          <div className="row">
            <div className="col-md-12">
              <button
                className="btn btn-success"
                type="submit"
                form="beforeEventQuestionnaire"
              >
                Prihlásiť
              </button>
            </div>
          </div>
        </Footer>
      </Modal>
    );
  }
}

BeforeEventQuestionnaire = reduxForm({
  form: 'beforeEventForm',
})(BeforeEventQuestionnaire);

export default connect((state) => ({
  actualEvent: state.events.get('actualEvent'),
}), eventActions)(BeforeEventQuestionnaire);
