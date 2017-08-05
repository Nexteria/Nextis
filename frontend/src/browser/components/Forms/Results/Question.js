import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';

import ShortText from './QuestionTypes/ShortText';
import LongText from './QuestionTypes/LongText';
import SelectList from './QuestionTypes/SelectList';
import ChoiceList from './QuestionTypes/ChoiceList';
import Multichoice from './QuestionTypes/Multichoice';

export default class Question extends Component {

  static propTypes = {
    question: PropTypes.object.isRequired,
    results: PropTypes.object.isRequired,
  }

  render() {
    const {
      question,
      results,
    } = this.props;

    return (
      <Card style={{ marginBottom: '1em' }}>
        <CardHeader
          title={`#${question.get('order') + 1} ${question.get('question')}`}
          style={{ backgroundColor: '#ccc' }}
          subtitle=""
        />
        <CardText>
          {question.get('type') === 'shortText' ?
            <ShortText question={question} results={results} /> : null}
          {question.get('type') === 'longText' ?
            <LongText question={question} results={results} /> : null}
          {question.get('type') === 'multichoice' ?
            <Multichoice question={question} results={results} /> : null}
          {question.get('type') === 'choiceList' ?
            <ChoiceList question={question} results={results} /> : null}
          {question.get('type') === 'selectList' ?
            <SelectList question={question} results={results} /> : null}
        </CardText>
        <CardActions>
        </CardActions>
      </Card>
    );
  }
}
