import React from 'react';
import toastr from 'toastr';
import TextField from '@material-ui/core/TextField';
import RaisedButton from '@material-ui/core/RaisedButton';
import uuidv4 from 'uuid';
import { Map } from 'immutable';
import { SortableContainer, SortableHandle, SortableElement } from 'react-sortable-hoc';
import SelectField from '@material-ui/core/SelectField';
import MenuItem from '@material-ui/core/MenuItem';
import ReorderIcon from '@material-ui/core/icons/action/reorder';
import CloseIcon from '@material-ui/core/icons/navigation/close';

const styles = {
  newChoiceIcon: {
    marginRight: '1em',
  },
  dragIcon: {
    color: '#999',
    width: '15px',
    position: 'absolute',
    top: '0.8em',
    cursor: 'move',
  },
  choiceNumber: {
    marginRight: '1em',
    marginLeft: '2em',
  },
  sortableItem: {
    position: 'relative',
  },
  removeChoiceButton: {
    margin: '0em',
    marginLeft: '1em',
    height: '26px',
    width: '26px',
    minWidth: '26px',
    padding: '0px',
  },
};

export function getNewChoice(choiceId, order) {
  return new Map({
    id: choiceId,
    title: 'Možnosť',
    selected: false,
    order: order || 0,
  });
}

const DragHandle = SortableHandle(() => <ReorderIcon style={styles.dragIcon} />);

const SortableItem = SortableElement(({ choice, onChange, onRemove }) =>
  <div style={styles.sortableItem}>
    <DragHandle />
    <span style={styles.choiceNumber}>#{`${choice.get('order') + 1}`}</span>
    <TextField
      value={choice.get('title')}
      onChange={(e, v) => onChange(v)}
      name={`question-option-title-${choice.get('id')}`}
    />
    {onRemove ?
      <span>
        <RaisedButton
          icon={<CloseIcon style={{ width: '20px' }} />}
          onClick={onRemove}
          backgroundColor="#e51c23"
          labelColor="#fff"
          style={styles.removeChoiceButton}
          buttonStyle={{ width: '26px' }}
        />
      </span>
      : null
    }
  </div>
);

const SortableList = SortableContainer(({ question, onChange, choicesList, questions }) => {
  const choicesCount = question.get('choices').size;
  const maxSelection = question.get('maxSelection');
  const minSelection = question.get('minSelection');

  let removeFunction = null;

  if (choicesCount > 1 && minSelection < choicesCount && maxSelection < choicesCount) {
    removeFunction = (choice) => () => {
      const dependencies = choicesList.getIn([question.get('id'), choice.get('id')]);
      if (dependencies.size > 0) {
        const depString = dependencies.keySeq().map(key => `#${questions.getIn([key, 'order']) + 1}`).toArray().join(', ');
        toastr.options.closeButton = true;
        toastr.options.timeOut = 10000;
        toastr.warning(`<p>Na tejto možnosti je závislá <b>otázka ${depString}</b></p><p>Odstránte najskôr všetky závislosti</p>`);
        return ;
      }

      onChange(
        question.updateIn(['choices'], choices => choices.map(currentChoice => {
          if (currentChoice.get('order') >= choice.get('order')) {
            return currentChoice.set('order', currentChoice.get('order') - 1);
          }
          return currentChoice;
        })).deleteIn(['choices', choice.get('id')])
      );
    }
  }

  return (
    <div>
      {question.get('choices').sort((a, b) => a.get('order') - b.get('order')).map(choice =>
        <SortableItem
          key={`item-${choice.get('order')}`}
          index={choice.get('order')}
          choice={choice}
          onChange={(value) => onChange(
            question.setIn(['choices', choice.get('id'), 'title'], value)
          )}
          onRemove={removeFunction ? removeFunction(choice) : null}
        />
      )}
    </div>
  );
});

export default function renderChoiceQuestion(data) {
  const { question, questions, onChange, choicesList } = data;

  const maxSelection = question.get('maxSelection') || question.get('choices').size;
  const minSelection = question.get('minSelection');

  return (
    <div>
      <label style={{ color: '#ccc', marginTop: '1em' }}>Možnosti</label>
      <SortableList
        helperClass="sortable-helper-class2"
        question={question}
        questions={questions}
        choicesList={choicesList}
        onChange={onChange}
        useDragHandle
        onSortEnd={(pos) => onChange(
          question.update('choices', choices => choices.map(choice => {
            if (pos.oldIndex < pos.newIndex) {
              if (choice.get('order') > pos.oldIndex && choice.get('order') <= pos.newIndex) {
                return choice.set('order', choice.get('order') - 1);
              }

              if (choice.get('order') === pos.oldIndex) {
                return choice.set('order', pos.newIndex);
              }
            } else {
              if (choice.get('order') >= pos.newIndex && choice.get('order') < pos.oldIndex) {
                return choice.set('order', choice.get('order') + 1);
              }

              if (choice.get('order') === pos.oldIndex) {
                return choice.set('order', pos.newIndex);
              }
            }

            return choice;
          }))
        )}
      />
      {question.get('type') === 'multichoice' ?
        <div>
          <SelectField
            value={minSelection}
            onChange={(e, i, value) => onChange(question.set('minSelection', value))}
            floatingLabelText="Minimálny počet"
            floatingLabelFixed
          >
            {[...Array(Math.min(question.get('choices').size, maxSelection))].map((v, index) =>
              <MenuItem key={index} value={index + 1} primaryText={index + 1} />
            )}
          </SelectField>
          <SelectField
            value={maxSelection}
            onChange={(e, i, value) => onChange(question.set('maxSelection', value))}
            floatingLabelText="Maximálny počet"
            floatingLabelFixed
          >
            {[...Array(question.get('choices').size - minSelection + 1)].map((v, index) =>
              <MenuItem
                key={index}
                value={index + minSelection}
                primaryText={index + minSelection}
              />
            )}
          </SelectField>
        </div>
        : null
      }
      <div>
        <RaisedButton
          onTouchTap={() => {
            const choice = getNewChoice(uuidv4(), question.get('choices').size);
            onChange(question.update('choices', choices => choices.set(choice.get('id'), choice)));
          }}
          backgroundColor="#9c27b0"
          labelColor="#fff"
          label={
            <span>
              <i
                className="fa fa-plus"
                style={styles.newChoiceIcon}
              ></i>
              Nová možnosť
            </span>
          }
        />
      </div>
    </div>
  );
}
