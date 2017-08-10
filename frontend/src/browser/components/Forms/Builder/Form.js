import React from 'react';
import toastr from 'toastr';
import { Map } from 'immutable';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import uuidv4 from 'uuid';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';


import Question, { getQuestionIcon } from './Question';
import { getNewChoice } from './QuestionTypes/ChoiceQuestion';

import './Form.scss';

const styles = {
  newQuestionIcon: {
    marginRight: '1em',
  }
};


export function createInitialState() {
  return new Map({
    formData: new Map({
      id: uuidv4(),
      name: 'Dotazník bez mena',
      description: '',
      groupDescriptions: new Map(),
      questions: new Map({}),
    }),
    choicesList: new Map(),
    isOpen: true,
    isNewQuestionMenuOpen: false,
  });
}

export function getNewQuestion(questionType, order) {
  const questionId = uuidv4();
  const choiceId = uuidv4();

  switch (questionType) {
    case 'shortText':
    case 'longText':
      return new Map({
        id: questionId,
        question: 'Text otázky',
        answer: '',
        required: false,
        dependentOn: new Map(),
        minSelection: 1,
        maxSelection: null,
        order,
        groupSelection: new Map(),
        type: questionType,
      });

    case 'multichoice':
      return new Map({
        id: questionId,
        question: 'Text otázky',
        choices: new Map().set(choiceId, getNewChoice(choiceId)),
        required: false,
        dependentOn: new Map(),
        minSelection: 1,
        maxSelection: null,
        order,
        groupSelection: new Map(),
        type: questionType,
      });
    case 'choiceList':
      return new Map({
        id: questionId,
        question: 'Text otázky',
        choices: new Map().set(choiceId, getNewChoice(choiceId)),
        required: false,
        dependentOn: new Map(),
        minSelection: 1,
        maxSelection: 1,
        order,
        groupSelection: new Map(),
        type: questionType,
      });
    case 'selectList':
      return new Map({
        id: questionId,
        question: 'Text otázky',
        choices: new Map().set(choiceId, getNewChoice(choiceId)),
        required: false,
        dependentOn: new Map(),
        minSelection: 1,
        maxSelection: 1,
        order,
        groupSelection: new Map(),
        type: questionType,
      });
  }

  return new Map();
}

const SortableItem = SortableElement(({ question, onChange, form, attendeesGroups }) =>
  <Question
    question={question}
    attendeesGroups={attendeesGroups}
    choicesList={form.get('choicesList')}
    questions={form.getIn(['formData', 'questions'])}
    onChange={(data) => {
      let newForm = form.setIn(['formData', 'questions', question.get('id')], data);
      if (data.has('choices')) {
        if (!newForm.hasIn(['choicesList', data.get('id')])) {
          newForm = newForm.setIn(['choicesList', data.get('id')], new Map());
        }
        let choicesList = newForm.getIn(['choicesList', data.get('id')])
                              .filter((val, choice) => data.hasIn(['choices', choice]));
        data.get('choices').forEach(choice => {
          if (!choicesList.has(choice.get('id'))) {
            choicesList = choicesList.set(choice.get('id'), new Map());
          }
        });
        newForm = newForm.setIn(['choicesList', question.get('id')], choicesList);
      }

      data.get('dependentOn').forEach((val, qKey) => {
        data.getIn(['dependentOn', qKey]).forEach((var2, chKey) => {
          if (data.getIn(['dependentOn', qKey, chKey])) {
            newForm = newForm.setIn(['choicesList', qKey, chKey, question.get('id')], true);
          } else {
            newForm = newForm.deleteIn(['choicesList', qKey, chKey, question.get('id')]);
          }
        });
      });

      onChange(newForm);
    }}
    onRemove={() => {
      const dependencies = form.getIn(['choicesList', question.get('id')]).reduce((reduction, value) => {
        let newReduction = reduction;
        value.keySeq().forEach(key => {
          newReduction = newReduction.set(key, true);
        });
        return newReduction;
      }, new Map());
      if (dependencies.size > 0) {
        const depString = dependencies.keySeq().map(key => `#${form.getIn(['formData', 'questions', key, 'order']) + 1}`).toArray().join(', ');
        toastr.options.closeButton = true;
        toastr.options.timeOut = 10000;
        toastr.warning(`<p>Na tejto otázke je závislá <b>otázka ${depString}</b></p><p>Odstránte najskôr všetky závislosti</p>`);
        return question;
      }

      onChange(
        form.updateIn(['formData', 'questions'], allQ => allQ.map(curQ => {
          if (curQ.get('order') >= question.get('order')) {
            return curQ.set('order', curQ.get('order') - 1);
          }
          return curQ;
        })).deleteIn(['formData', 'questions', question.get('id')])
      );
    }}
  />
);

const SortableList = SortableContainer(({ questions, onChange, form, attendeesGroups }) =>
  <div>
    {questions.sort((a, b) => a.get('order') - b.get('order')).map((question) => (
      <SortableItem
        key={`item-${question.get('order')}`}
        index={question.get('order')}
        question={question}
        attendeesGroups={attendeesGroups}
        onChange={onChange}
        form={form}
      />
    ))}
  </div>
);

export default function renderFormBuilder(data) {
  const { form, onChange, attendeesGroups } = data;

  const questions = form.getIn(['formData', 'questions']);
  const isNewQuestionMenuOpen = form.get('isNewQuestionMenuOpen');

  return (
    <Modal
      show={form.get('isOpen')}
      bsSize="large"
      dialogClassName="event-details-dialog"
      onHide={() => onChange(form.set('isOpen', false))}
    >
      <Header closeButton>
        <Title>
          <TextField
            name={`form-name-${form.getIn(['formData', 'id'])}`}
            value={form.getIn(['formData', 'name'])}
            onChange={(e, v) => onChange(form.setIn(['formData', 'name'], v))}
            floatingLabelText="Názov formulára"
            fullWidth
          />

          <Tabs
            mountOnEnter
            animation
            defaultActiveKey={1}
            id="event-dependencies"
            className="nav-tabs-custom"
          >
            <Tab eventKey={1} title={'Predvolený'}>
              <TextField
                name={`form-description-${form.getIn(['formData', 'id'])}`}
                value={form.getIn(['formData', 'description'])}
                onChange={(e, v) => onChange(form.setIn(['formData', 'description'], v))}
                floatingLabelText="Popis formulára"
                rows={3}
                multiLine
                fullWidth
                textareaStyle={{ border: '1px solid #ccc', padding: '1em' }}
              />
            </Tab>

            {attendeesGroups.map(group => {
              const gId = group.get('id') || uuidv4();

              return (
                <Tab eventKey={gId} title={group.get('name')}>
                  <TextField
                    name={`group-description-${gId}`}
                    value={form.getIn(['formData', 'groupDescriptions', gId])}
                    onChange={(e, v) => onChange(form.setIn(['formData', 'groupDescriptions', gId], v))}
                    floatingLabelText="Popis formulára"
                    rows={3}
                    multiLine
                    fullWidth
                    textareaStyle={{ border: '1px solid #ccc', padding: '1em' }}
                  />
                </Tab>
              );
            })}
          </Tabs>
        </Title>
      </Header>

      <Body>
        <div className="form-group">
          <SortableList
            form={form}
            attendeesGroups={attendeesGroups}
            helperClass="sortable-helper-class"
            questions={questions}
            onChange={onChange}
            useDragHandle
            onSortEnd={(positions) => onChange(
              form.updateIn(['formData', 'questions'], allQ => allQ.map(curQ => {
                if (positions.oldIndex < positions.newIndex) {
                  if (curQ.get('order') > positions.oldIndex && curQ.get('order') <= positions.newIndex) {
                    return curQ.set('order', curQ.get('order') - 1);
                  }

                  if (curQ.get('order') === positions.oldIndex) {
                    return curQ.set('order', positions.newIndex);
                  }
                } else {
                  if (curQ.get('order') >= positions.newIndex && curQ.get('order') < positions.oldIndex) {
                    return curQ.set('order', curQ.get('order') + 1);
                  }

                  if (curQ.get('order') === positions.oldIndex) {
                    return curQ.set('order', positions.newIndex);
                  }
                }

                return curQ;
              }))
            )}
          />

          <div className="col-sm-10">
          </div>
          <RaisedButton
            onTouchTap={() => onChange(form.set('isNewQuestionMenuOpen', !isNewQuestionMenuOpen))}
            backgroundColor="#9c27b0"
            labelColor="#fff"
            label={
              <span>
                <i
                  className="fa fa-plus"
                  style={styles.newQuestionIcon}
                ></i>
                Nová otázka
              </span>
            }
          />
          <IconMenu
            iconButtonElement={<span></span>}
            open={isNewQuestionMenuOpen}
            onRequestChange={() => onChange(form.set('isNewQuestionMenuOpen', !isNewQuestionMenuOpen))}
            useLayerForClickAway
            onItemTouchTap={(e, data) => {
              const question = getNewQuestion(data.props.value, questions.size);
              onChange(form.updateIn(['formData', 'questions'], qData => {
                return qData.set(question.get('id'), question);
              }).update('choicesList', list => {
                let newList = list.set(question.get('id'), new Map());
                if (question.has('choices')) {
                  question.get('choices').forEach(choice => {
                    newList = newList.setIn([question.get('id'), choice.get('id')], new Map());
                  });
                }
                return newList;
              }));
            }}
          >
            <MenuItem
              leftIcon={getQuestionIcon('shortText')}
              value="shortText"
              primaryText="Krátky text"
            />
            <MenuItem
              leftIcon={getQuestionIcon('longText')}
              value="longText"
              primaryText="Dlhý text"
            />
            <MenuItem
              leftIcon={getQuestionIcon('multichoice')}
              value="multichoice"
              primaryText="Viac možností"
            />
            <MenuItem
              leftIcon={getQuestionIcon('choiceList')}
              value="choiceList"
              primaryText="Výber možnosti"
            />
            <MenuItem
              leftIcon={getQuestionIcon('selectList')}
              value="selectList"
              primaryText="Zoznam možností"
            />
          </IconMenu>
        </div>
      </Body>

      <Footer>
        <div className="col-md-12" style={{ marginTop: '1em' }}>
          <button
            className="btn btn-danger"
            onClick={() => onChange(createInitialState())}
          >
            Reset formulára
          </button>
          <button
            className="btn btn-success"
            onClick={() => onChange(form.set('isOpen', false))}
          >
            Zavrieť a uložiť
          </button>
        </div>
      </Footer>
    </Modal>
  );
}
