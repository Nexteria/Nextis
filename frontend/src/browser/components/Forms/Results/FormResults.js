import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as eventActions from '../../../../common/events/actions';
import Question from './Question';

export class FormResults extends Component {

  static propTypes = {
    actualEvent: PropTypes.object.isRequired,
    closeEventDetailsDialog: PropTypes.func.isRequired,
    formId: PropTypes.func.isRequired,
    fetchQuestionnaireResults: PropTypes.func.isRequired,
    events: PropTypes.object.isRequired,
    downloadTextAnswers: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { formId, fetchQuestionnaireResults } = this.props;
    fetchQuestionnaireResults(formId);
  }

  render() {
    const {
      actualEvent,
      events,
      downloadTextAnswers,
    } = this.props;

    const event = events.get(actualEvent.get('id'));
    if (!event) {
      return <div></div>;
    }

    return (
      <div>
        <h4>{event.get('name')}</h4>
        {event.getIn(['questionForm', 'formData', 'questions']).sort((a, b) => a.get('order') - b.get('order')).map(question =>
          <Question
            key={question.get('id')}
            question={question}
            downloadTextAnswers={downloadTextAnswers}
            results={actualEvent.getIn(['formResults', question.get('id')])}
          />
        )}
      </div>
    );
  }
}

export default connect((state) => ({
  actualEvent: state.events.get('actualEvent'),
  events: state.events.events,
}), eventActions)(FormResults);
