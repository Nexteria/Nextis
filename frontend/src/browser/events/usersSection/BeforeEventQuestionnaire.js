import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Modal, { Header, Body, Footer } from 'react-bootstrap/lib/Modal';


import Form from '../../components/Forms/Questionnaire/Form';

import * as eventActions from '../../../common/events/actions';

export class BeforeEventQuestionnaire extends Component {

  static propTypes = {
    actualEvent: PropTypes.object.isRequired,
    closeEventDetailsDialog: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    fetchBeforeEventQuestionnaire: PropTypes.func.isRequired,
    initialized: PropTypes.bool.isRequired,
    attendeeSignIn: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    formData: PropTypes.object,
    submitFunc: PropTypes.func,
    saveSignInForm: PropTypes.func.isRequired,
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
    const { input, attendeeGroupId } = data;

    return (
      <Form
        form={input.value}
        onChange={input.onChange}
        attendeeGroupId={attendeeGroupId}
      />
    );
  }

  render() {
    const {
      location,
      handleSubmit,
      attendeeSignIn,
      actualEvent,
      formData,
      submitFunc,
      saveSignInForm,
    } = this.props;

    if (!formData) {
      return <div></div>;
    }

    const { viewerId, groupId } = location.state;

    let submitFunction = (data) => {
      saveSignInForm(data.formData, actualEvent.get('id'));
      attendeeSignIn(viewerId);
      browserHistory.push(`/events/${actualEvent.get('id')}`);
    };

    if (submitFunc) {
      submitFunction = submitFunc;
    }

    const isFormValid = formData.get('questions')
      .filter(q => q.get('groupSelection').size === 0 || q.hasIn(['groupSelection', groupId]))
      .filter(question => question.get('dependentOn').every((q, qId) => q.every((choice, chId) => formData.getIn(['questions', qId, 'choices', chId, 'selected']))))
      .filter(q => q.get('required'))
      .every(q => {
        let isValid = true && q.get('answer');
        if (q.get('type') === 'shortText' || q.get('type') === 'longText' && q.get('minSelection')) {
          isValid = isValid && (q.get('answer').length >= q.get('minSelection'));
        }

        if (q.get('type') === 'multichoice') {
          isValid = isValid && (q.get('answer').size >= q.get('minSelection'));
        }

        return isValid;
      });

    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="event-details-dialog"
        onHide={() => {}}
      >
        <Header style={{ display: 'none' }} />
        <form
          id="beforeEventQuestionnaire"
          onSubmit={handleSubmit((data) => submitFunction(data))}
        >
          <Body>
            <div className="row">
              <Field
                name="formData"
                attendeeGroupId={groupId}
                component={this.renderFormComponent}
              />
            </div>
          </Body>

          <Footer>
            <div className="row">
              <div className="col-md-12">
                {!isFormValid ?
                  <div className="pull-left text-danger">Prosím vyplň všetky povinné otázky</div>
                  : null
                }
                <button
                  className="btn btn-danger"
                  onClick={() => browserHistory.push('/events')}
                  type="button"
                >
                  Zavrieť
                </button>
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={!isFormValid}
                >
                  Prihlásiť
                </button>
              </div>
            </div>
          </Footer>
        </form>
      </Modal>
    );
  }
}

BeforeEventQuestionnaire = reduxForm({
  form: 'beforeEventForm',
})(BeforeEventQuestionnaire);

const selector = formValueSelector('beforeEventForm');

export default connect((state) => ({
  formData: selector(state, 'formData'),
  actualEvent: state.events.get('actualEvent'),
}), eventActions)(BeforeEventQuestionnaire);
