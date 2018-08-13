import React from 'react';

import ShortText from './QuestionTypes/ShortText';
import LongText from './QuestionTypes/LongText';
import ChoiceList from './QuestionTypes/ChoiceList';
import Multichoice from './QuestionTypes/Multichoice';
import SelectList from './QuestionTypes/SelectList';

export default class Question extends React.Component {
  render() {
    const {
      question,
      onChange,
      index,
      answer
    } = this.props;

    return (
      <div className="col-md-12">
        <h4>
          <span>
            {`#${index + 1} `}
          </span>
          <span>
            {question.question}
          </span>
          <span style={{ color: '#f00' }}>
            {question.required ? ' (povinná)' : ''}
          </span>
        </h4>
        {question.type === 'shortText'
          ? <ShortText answer={answer} question={question} onChange={onChange} /> : null}
        {question.type === 'longText'
          ? <LongText answer={answer} question={question} onChange={onChange} /> : null}
        {question.type === 'multichoice'
          ? <Multichoice answer={answer} question={question} onChange={onChange} /> : null}
        {question.type === 'choiceList'
          ? <ChoiceList answer={answer} question={question} onChange={onChange} /> : null}
        {question.type === 'selectList'
          ? <SelectList answer={answer} question={question} onChange={onChange} /> : null}
        <div className="clearfix" />
      </div>
    );
  }
}
