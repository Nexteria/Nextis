import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { Field, reduxForm, FieldArray } from 'redux-form';
import { browserHistory } from 'react-router';

import InputComponent from '../../components/Input';
import SelectComponent from '../../components/Select';
import DatePickerComponent from '../../components/DatePicker';


import * as semesterActions from '../../../common/semesters/actions';

const messages = defineMessages({
  closeButton: {
    defaultMessage: 'Close',
    id: 'event.users.detail.closeButton',
  },
  signOutButton: {
    defaultMessage: 'Sign out',
    id: 'event.users.detail.signOutButton',
  },
  signOutQuestion: {
    defaultMessage: 'Do you want to sign out from: {eventName} ?',
    id: 'event.users.detail.signOutQuestion',
  },
  signOutQuestionWonGo: {
    defaultMessage: 'Are you sure that you wont attend event: {eventName} ?',
    id: 'event.users.detail.signOutQuestionWonGo',
  },
  reasonDescription: {
    defaultMessage: 'Please state your reason for sign out:',
    id: 'event.users.detail.reasonDescription',
  },
  wontGoButton: {
    defaultMessage: 'Wont attend',
    id: 'event.users.detail.wontGoButton',
  },
});

export class NewSemesterDialog extends Component {

  static propTypes = {
    events: PropTypes.object.isRequired,
  }

  renderLevels({ fields, levels }) {
    const levelIds = fields.map((item, index, subfields) => subfields.get(index).id);
    const remainingLevelIds = levels.filter(level => !levelIds.includes(level.get('id')))
                                    .map(level => level.get('id')).toArray();

    return (
      <div>
        <label>Priradenie levelov:</label>
        {fields.map((item, index, subfields) =>
          <div key={item} className="form-group callout callout-default">
            <div className="form-group col-md-12">
              <div className="col-md-4 col-md-offset-4 text-center">
                <Field
                  name={`${item}.id`}
                  component={SelectComponent}
                  label={
                    <span>
                      <span>Level </span>
                      <i
                        className="fa fa-trash text-red"
                        style={{ cursor: 'pointer', marginLeft: '1em' }}
                        onClick={() => fields.remove(index)}
                      ></i>
                    </span>
                  }
                  normalize={value => parseInt(value, 10)}
                >
                  {levels.filter(level => level.get('id') === subfields.get(index).id || !levelIds.includes(level.get('id'))).map(level =>
                    <option
                      value={level.get('id')}
                      key={level.get('id')}
                    >
                      {level.name}
                    </option>
                  )}
                </Field>
              </div>
            </div>
            <div className="form-group">
              <div className="col-md-4">
                <Field
                  name={`${item}.tuitionFee`}
                  type="number"
                  component={InputComponent}
                  format={value => value / 100}
                  normalize={value => value * 100}
                  label={'Školné'}
                />
              </div>
              <div className="col-md-4">
                <Field
                  name={`${item}.activityPointsBaseNumber`}
                  type="number"
                  component={InputComponent}
                  label={'Bodový základ'}
                />
              </div>
              <div className="col-md-4">
                <Field
                  name={`${item}.minimumSemesterActivityPoints`}
                  type="number"
                  component={InputComponent}
                  label={'Minimum bodov'}
                />
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
        )}
        {remainingLevelIds.length ?
          <div className="col-md-12">
            <i
              className="fa fa-plus text-green"
              style={{ cursor: 'pointer', marginLeft: '2em' }}
              onClick={() => fields.push({
                id: remainingLevelIds[0],
                tuitionFee: levels.get(remainingLevelIds[0]).get('defaultTuitionFee'),
                activityPointsBaseNumber: levels.get(remainingLevelIds[0]).get('defaultActivityPointsBaseNumber'),
                minimumSemesterActivityPoints: levels.get(remainingLevelIds[0]).get('defaultMinimumSemesterActivityPoints'),
              })}
            ></i>
          </div>
          : null
        }
      </div>
    );
  }

  render() {
    const { levels, locale, saveSemester, handleSubmit } = this.props;

    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="event-details-dialog"
        onHide={() => null}
      >
        <Header>
          <Title>
            Novy semester
          </Title>
        </Header>

        <Body>
          <form className="form-group" id="newSemesterForm" onSubmit={handleSubmit((data) => saveSemester(data))}>
            <div className="col-md-12">
              <Field
                name="name"
                type="text"
                component={InputComponent}
                label={'Názov semestra*'}
              />
            </div>
            <div className="col-md-6">
              <Field
                name="startDate"
                component={DatePickerComponent}
                label={'Zaciatok semestra*'}
                locale={locale}
              />
            </div>
            <div className="col-md-6">
              <Field
                name="endDate"
                component={DatePickerComponent}
                label={'Koniec semestra*'}
                locale={locale}
              />
            </div>

            <FieldArray
              name="levels"
              rerenderOnEveryChange
              component={({ fields }) => this.renderLevels({ fields, levels })}
            />
          </form>
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-danger"
              onClick={() => browserHistory.goBack()}
            >
              Zrušiť
            </button>
            <button
              className="btn btn-success"
              type="submit"
              form="newSemesterForm"
            >
              Vytvoriť semester
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

NewSemesterDialog = reduxForm({
  form: 'newSemester',
})(NewSemesterDialog);

export default connect(state => ({
  levels: state.users.studentLevels,
  locale: state.intl.currentLocale,
}), semesterActions)(NewSemesterDialog);
