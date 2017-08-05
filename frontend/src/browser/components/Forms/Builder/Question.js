import React from 'react';
import { List, Map } from 'immutable';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import ReorderIcon from 'material-ui/svg-icons/action/reorder';
import ListIcon from 'material-ui/svg-icons/action/list';
import ShortTextIcon from 'material-ui/svg-icons/editor/border-color';
import LongTextIcon from 'material-ui/svg-icons/editor/insert-comment';
import RadioButtonIcon from 'material-ui/svg-icons/toggle/radio-button-checked';
import CheckBoxButtonIcon from 'material-ui/svg-icons/toggle/check-box';

import TextQuestion from './QuestionTypes/TextQuestion';
import ChoiceQuestion from './QuestionTypes/ChoiceQuestion';

import { SortableHandle } from 'react-sortable-hoc';

function renderQuestionType(question, onChange, choicesList, questions) {
  switch (question.get('type')) {
    case 'shortText':
    case 'longText':
      return (
        <TextQuestion
          question={question}
          onChange={onChange}
          choicesList={choicesList}
        />
    );

    case 'multichoice':
      return (
        <ChoiceQuestion
          question={question}
          onChange={onChange}
          questions={questions}
          choicesList={choicesList}
        />
    );

    case 'choiceList':
      return (
        <ChoiceQuestion
          question={question}
          onChange={onChange}
          choicesList={choicesList}
        />
    );

    case 'selectList':
      return (
        <ChoiceQuestion
          question={question}
          onChange={onChange}
          choicesList={choicesList}
        />
    );
  }

  return new Map();
}

const styles = {
  cardActionsContainer: {
    position: 'absolute',
    right: '0.6em',
    bottom: '0.6em',
  },
  dragIcon: {
    position: 'absolute',
    top: '1em',
    cursor: 'move',
    color: '#999',
  },
  questionTitle: {
    marginLeft: '2em',
  },
  card: {
    marginBottom: '1em',
  },
};

export function getQuestionIcon(questionType) {
  switch (questionType) {
    case 'shortText':
      return <ShortTextIcon />;
    case 'longText':
      return <LongTextIcon />;
    case 'multichoice':
      return <CheckBoxButtonIcon />;
    case 'choiceList':
      return <RadioButtonIcon />;
    case 'selectList':
      return <ListIcon />;
  }
  return null;
}

const DragHandle = SortableHandle(() => <ReorderIcon style={styles.dragIcon} />);

export default function renderTextQuestion(data) {
  const { question, onChange, onRemove, choicesList, questions } = data;

  return (
    <Card style={styles.card}>
      <CardHeader
        title={(
          <span>
            <DragHandle />
            <span style={styles.questionTitle}>
              {`Otázka #${question.get('order') + 1}`}
              <span style={{ position: 'absolute', right: '5em' }}>{getQuestionIcon(question.get('type'))}</span>
            </span>
            <span style={styles.cardActionsContainer}>
              <RaisedButton
                icon={<CloseIcon />}
                onClick={onRemove}
                backgroundColor="#e51c23"
                labelColor="#fff"
                style={{
                  margin: '0em',
                  width: '36px',
                  minWidth: '36px',
                  padding: '0px',
                }}
                buttonStyle={{ width: '36px' }}
              />
            </span>
          </span>
        )}
        style={{ backgroundColor: '#ccc' }}
        subtitle=""
      />
      <CardText>
        <TextField
          floatingLabelFixed
          name={`question-name-${question.get('id')}`}
          value={question.get('question')}
          onChange={(e, v) => onChange(question.set('question', v))}
          floatingLabelText="Názov otázky"
        />
        <Checkbox
          label="Povinná"
          checked={question.get('required')}
          onCheck={(e, v) => onChange(question.set('required', v))}
        />
        <SelectField
          multiple
          floatingLabelText="Zobraziť v prípade súčasného označenia možností:"
          hintText="Vyberte možnosti"
          fullWidth
          value={question.get('dependentOn').reduce((reduction, val, qKey) => {
            let newReduction = reduction;
            val.forEach((val2, chKey) => {
              if (question.getIn(['dependentOn', qKey, chKey])) {
                newReduction = newReduction.push(`${qKey}::${chKey}`);
              }
              return true;
            });

            return newReduction;
          }, new List())
            .toArray()
          }
          onChange={
            (e, i, values) => {
              let newDependency = question.get('dependentOn');

              newDependency.forEach((val, qKey) => {
                newDependency.get(qKey).forEach((val2, chKey) => {
                  newDependency = newDependency.setIn([qKey, chKey], false);
                });
              });
              values.map(value => {
                const tokens = value.split('::');
                const qKey = tokens[0];
                const chKey = tokens[1];

                newDependency = newDependency.setIn([qKey, chKey], true);
              });
              onChange(question.set('dependentOn', newDependency));
            }
          }
        >
          {choicesList.filter((val, key) => key !== question.get('id')).reduce((reduction, val, qKey) => {
            choicesList.get(qKey).forEach((val2, chKey) => {
              reduction = reduction.set(`${qKey}::${chKey}`,
                <MenuItem
                  insetChildren
                  key={`${qKey}::${chKey}`}
                  checked={choicesList.getIn([qKey, chKey, question.get('id')])}
                  value={`${qKey}::${chKey}`}
                  primaryText={`Otázka #${questions.getIn([qKey, 'order']) + 1} - možnosť #${questions.getIn([qKey, 'choices', chKey, 'order']) + 1}`}
                />
              );
            });

            return reduction;
          }, new Map()).toArray()}
        </SelectField>
        {renderQuestionType(question, onChange, choicesList, questions)}
      </CardText>
      <CardActions>
      </CardActions>
    </Card>
  );
}
