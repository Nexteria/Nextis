import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';

import ShortText from './QuestionTypes/ShortText';
import LongText from './QuestionTypes/LongText';
import SelectList from './QuestionTypes/SelectList';
import ChoiceList from './QuestionTypes/ChoiceList';
import Multichoice from './QuestionTypes/Multichoice';

const styles = {
  cardActionsContainer: {
    position: 'absolute',
    right: '0.6em',
    bottom: '0.6em',
  },
};

export default class Question extends Component {

  static propTypes = {
    question: PropTypes.object.isRequired,
    results: PropTypes.object.isRequired,
    downloadTextAnswers: PropTypes.func.isRequired,
  }

  render() {
    const {
      question,
      results,
      downloadTextAnswers,
    } = this.props;

    return (
      <Card style={{ marginBottom: '1em' }}>
        <CardHeader
          title={
            <span>
              {`#${question.get('order') + 1} ${question.get('question')}`}
              <span style={styles.cardActionsContainer}>
                {question.get('type') === 'shortText' || question.get('type') === 'longText' ?
                  <RaisedButton
                    icon={<DownloadIcon />}
                    onClick={() => downloadTextAnswers(question.get('id'))}
                    labelColor="#888"
                    style={{
                      margin: '0em',
                      width: '36px',
                      minWidth: '36px',
                      padding: '0px',
                    }}
                    buttonStyle={{ width: '36px' }}
                  />
                  : null
                }
              </span>
            </span>
          }
          style={{ backgroundColor: '#ccc' }}
          subtitle=""
        />
        {results ?
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
          :
          <CardText>
            Žiadne odpovede
          </CardText>
        }
        <CardActions>
        </CardActions>
      </Card>
    );
  }
}
