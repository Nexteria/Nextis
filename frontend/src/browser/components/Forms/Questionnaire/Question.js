import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';

import ShortText from './QuestionTypes/ShortText';
import LongText from './QuestionTypes/LongText';
import ChoiceList from './QuestionTypes/ChoiceList';
import Multichoice from './QuestionTypes/Multichoice';
import SelectList from './QuestionTypes/SelectList';

export default class Question extends Component {

  static propTypes = {
    question: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
  }

  render() {
    const {
      question,
      onChange,
      index,
    } = this.props;

    return (
      <div className="col-md-12">
        <h4>
          <span>#{index + 1} </span>
          <span>{question.get('question')}</span>
          <span style={{ color: '#f00' }}>{question.get('required') ? ' (povinná)' : ''}</span>
        </h4>
        {question.get('type') === 'shortText' ?
          <ShortText question={question} onChange={onChange} /> : null}
        {question.get('type') === 'longText' ?
          <LongText question={question} onChange={onChange} /> : null}
        {question.get('type') === 'multichoice' ?
          <Multichoice question={question} onChange={onChange} /> : null}
        {question.get('type') === 'choiceList' ?
          <ChoiceList question={question} onChange={onChange} /> : null}
        {question.get('type') === 'selectList' ?
          <SelectList question={question} onChange={onChange} /> : null}
        <div className="clearfix"></div>
      </div>
    );
  }
}
