import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import RichTextEditor from 'react-rte';
import validator from 'validator';


import * as actions from '../../../../common/students/actions';
import * as semesterActions from '../../../../common/semesters/actions';
import * as eventsActions from '../../../../common/events/actions';
import SelectComponent from '../../../components/Select';
import InputComponent from '../../../components/Input';
import TextEditor from '../../../components/TextEditor';

class AddActivityPoints extends Component {

  static propTypes = {
    semesters: PropTypes.object,
    hasPermission: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    activityType: PropTypes.string,
    fetchAdminSemesters: PropTypes.func.isRequired,
    fetchEventsDropdownList: PropTypes.func.isRequired,
    events: PropTypes.object,
    semesterId: PropTypes.number,
    selectedStudents: PropTypes.object,
    addActivityPoints: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchAdminSemesters, fetchEventsDropdownList } = this.props;
    fetchAdminSemesters();
    fetchEventsDropdownList();
  }

  render() {
    const {
      handleSubmit,
      semesterId,
      events,
      semesters,
      selectedStudents,
      activityType,
      addActivityPoints,
      reset,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form
            id="addActivityPoints"
            onSubmit={handleSubmit((data) => {
              addActivityPoints(data, selectedStudents);
              reset();
            })}
          >
            <div className="col-md-12">
              <div className="col-md-6">
                <Field
                  name={'activityType'}
                  component={SelectComponent}
                  label={"Typ aktivity"}
                >
                  <option value="" disabled>Vyberte možnosť</option>
                  <option value={'event'} >Event</option>
                  <option value={'volunteer'} >Dobrovolnícka</option>
                  <option value={'other'} >Iné</option>
                </Field>
              </div>
              <div className="col-md-6">
                <Field
                  name={'activityModelId'}
                  component={SelectComponent}
                  label={"Aktivita"}
                  readOnly={activityType !== 'event'}
                >
                  <option value="" disabled>Vyberte možnosť</option>
                  {activityType === 'event' ?
                    events.filter(event => event.semesterId === semesterId).map(event =>
                      <option value={event.id} key={event.id}>{event.name}</option>
                    ) : null
                  }
                </Field>
              </div>
            </div>
            <div className="col-md-12">
              <div className="col-md-6">
                <Field
                  name={'gainedPoints'}
                  type="number"
                  component={InputComponent}
                  label={'Získané body'}
                />
              </div>
              <div className="col-md-6">
                <Field
                  name={'maxPossiblePoints'}
                  type="number"
                  component={InputComponent}
                  label={'Možné maximum bodov'}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="col-md-6">
                <Field
                  name={'semesterId'}
                  normalize={value => parseInt(value, 10)}
                  component={SelectComponent}
                  label={"Semester"}
                >
                  {semesters.map(semester =>
                    <option
                      value={semester.get('id')}
                      key={semester.get('id')}
                    >
                      {semester.get('name')}
                    </option>
                  )}
                )}
                </Field>
              </div>
              <div className="col-md-6">
                <Field
                  name={'name'}
                  type="text"
                  component={InputComponent}
                  label="Názov aktivity"
                />
              </div>
            </div>
            <div className="col-md-12">
              <Field
                name={'note'}
                component={TextEditor}
                label="Poznámka"
              />
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-success"
                type="submit"
                form="addActivityPoints"
              >
                Pridať body
              </button>
            </div>
          </form>
          <div className="clearfix"></div>
        </div>
      </section>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Povinné pole';
  }

  if (!values.activityType) {
    errors.activityType = 'Povinné pole';
  }

  if (values.activityType === 'event') {
    if (!values.activityModelId) {
      errors.activityModelId = 'Povinné pole';
    }
  }

  if (!values.maxPossiblePoints) {
    errors.maxPossiblePoints = 'Povinné pole';
  } else if (!validator.isNumeric(values.maxPossiblePoints)) {
    errors.maxPossiblePoints = 'Hodnota musí byť číslo';
  }

  if (!values.gainedPoints) {
    errors.gainedPoints = 'Povinné pole';
  } else if (!validator.isNumeric(values.gainedPoints)) {
    errors.gainedPoints = 'Hodnota musí byť číslo';
  }

  return errors;
};

AddActivityPoints = reduxForm({
  form: 'AddActivityPoints',
  validate,
})(AddActivityPoints);

const selector = formValueSelector('AddActivityPoints');

export default connect(state => ({
  activityType: selector(state, 'activityType'),
  semesterId: selector(state, 'semesterId'),
  events: state.events.get('eventsDropdownList'),
  semesters: state.semesters.getIn(['admin', 'semesters']),
  hasPermission: (permission) => state.users.hasPermission(permission, state),
  initialValues: {
    note: RichTextEditor.createValueFromString('', 'html'),
    activityType: '',
    activityModelId: null,
    semesterId: state.semesters.get('activeSemesterId'),
  },
}), { ...actions, ...semesterActions, ...eventsActions })(AddActivityPoints);
