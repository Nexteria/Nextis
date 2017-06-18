import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';


import SelectComponent from '../../../components/Select';
import InputComponent from '../../../components/Input';
import * as actions from '../../../../common/semesters/actions';

class AsignNewSemesterAction extends Component {

  static propTypes = {
    semesters: PropTypes.object,
    fields: PropTypes.object.isRequired,
    fetchAdminStudents: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { fetchAdminSemesters } = this.props;
    fetchAdminSemesters();
  }

  render() {
    const {
      useDefaultMininumPoints,
      useDefaultPointsBaseNumber,
      useDefaultTuitionFee,
      semesters,
      selectedStudents,
      handleSubmit,
      assignSemester,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form id="assignSemestersForm" onSubmit={handleSubmit((data) => assignSemester(data, selectedStudents))}>
            <div className="col-md-12">
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
            <div className="col-md-12">
              <div className="col-md-6">
                <Field
                  name={'tuitionFee'}
                  type="number"
                  component={InputComponent}
                  format={value => value / 100}
                  normalize={value => value * 100}
                  label={'Školné'}
                  readOnly={useDefaultTuitionFee}
                />
              </div>
              <div className="col-md-6">
                <Field
                  name={'useDefaultTuitionFee'}
                  type="checkbox"
                  component={InputComponent}
                  label={'Použiť aktuálne hodnoty študenta'}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="col-md-6">
                <Field
                  name={'activityPointsBaseNumber'}
                  type="number"
                  component={InputComponent}
                  label={'Bodový základ'}
                  readOnly={useDefaultPointsBaseNumber}
                />
              </div>
              <div className="col-md-6">
                <Field
                  name={'useDefaultActivityPointsBaseNumber'}
                  type="checkbox"
                  component={InputComponent}
                  label={'Použiť aktuálne hodnoty študenta'}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="col-md-6">
                <Field
                  name={'minimumSemesterActivityPoints'}
                  type="number"
                  component={InputComponent}
                  label={'Minimum bodov'}
                  readOnly={useDefaultMininumPoints}
                />
              </div>
              <div className="col-md-6">
                <Field
                  name={'useDefaultMinimumSemesterActivityPoints'}
                  type="checkbox"
                  component={InputComponent}
                  label={'Použiť aktuálne hodnoty študenta'}
                />
              </div>
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-success"
                type="submit"
                form="assignSemestersForm"
              >
                Priradiť semester
              </button>
            </div>
          </form>
          <div className="clearfix"></div>
        </div>
      </section>
    );
  }
}

AsignNewSemesterAction = reduxForm({
  form: 'AsignNewSemesterAction',
})(AsignNewSemesterAction);

const selector = formValueSelector('AsignNewSemesterAction');

export default connect(state => ({
  semesters: state.semesters.getIn(['admin', 'semesters']),
  useDefaultMininumPoints: selector(state, 'useDefaultMinimumSemesterActivityPoints'),
  useDefaultPointsBaseNumber: selector(state, 'useDefaultActivityPointsBaseNumber'),
  useDefaultTuitionFee: selector(state, 'useDefaultTuitionFee'),
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(AsignNewSemesterAction);
