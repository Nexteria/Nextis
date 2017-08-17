import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';

import * as eventActions from '../../../../common/events/actions';
import Question from './Question';

export class FormResults extends Component {

  static propTypes = {
    actualEvent: PropTypes.object.isRequired,
    closeEventDetailsDialog: PropTypes.func.isRequired,
    formId: PropTypes.func.isRequired,
    fetchQuestionnaireResults: PropTypes.func.isRequired,
    events: PropTypes.object.isRequired,
    downloadAnswers: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { formId, fetchQuestionnaireResults } = this.props;
    fetchQuestionnaireResults(formId);
  }

  render() {
    const {
      actualEvent,
      events,
      downloadAnswers,
    } = this.props;

    const event = events.get(actualEvent.get('id'));
    if (!event) {
      return <div></div>;
    }

    return (
      <div style={{ position: 'relative' }}>
        <h4>{event.get('name')}</h4>
        <RaisedButton
          icon={<DownloadIcon />}
          onClick={() => downloadAnswers(event.getIn(['questionForm', 'formData', 'id']))}
          labelColor="#fff"
          style={{
            margin: '0em',
            width: '36px',
            minWidth: '36px',
            padding: '0px',
            right: '0px',
            top: '-1em',
            position: 'absolute',
          }}
          backgroundColor="#9c27b0"
          buttonStyle={{ width: '36px' }}
        />
        {event.getIn(['questionForm', 'formData', 'questions']).sort((a, b) => a.get('order') - b.get('order')).map(question =>
          <Question
            key={question.get('id')}
            question={question}
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
