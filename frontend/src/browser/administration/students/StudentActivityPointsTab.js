import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';


import * as actions from '../../../common/students/actions';
import * as usersActions from '../../../common/users/actions';
import ActivityPointsTable from '../../activityPoints/ActivityPointsTable';
import SelectComponent from '../../components/Select';


const styles = {
  semesterSelector: {
    maxWidth: '220px',
    margin: 'auto',
    marginBottom: '10px',
  },
};

class StudentActivityPointsTab extends Component {

  static propTypes = {
    student: PropTypes.object.isRequired,
    initialize: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    createStudentComment: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    fetchEventActivityDetails: PropTypes.func.isRequired,
    initialized: PropTypes.bool.isRequired,
    fetchStudent: PropTypes.func.isRequired,
    semesters: PropTypes.object,
  };

  render() {
    const { student, semesters, fetchStudent, fetchEventActivityDetails } = this.props;

    return (
      <div>
        <div className="box">
          <div className="box-body no-padding text-center" style={{ fontSize: '2em' }}>
            <div>Počet bodov:</div>
            <span>
              {student.get('sumGainedPoints')} z {student.get('activityPointsBaseNumber')}
            </span>
            <div className="form-group">
              <Field
                name={'semesterId'}
                component={SelectComponent}
                style={styles.semesterSelector}
                normalize={value => {
                  fetchStudent(student.get('id'), value);
                  return parseInt(value, 10);
                }}
              >
                <option key={-1} value={0} disabled>Vyber semester</option>
                {semesters.valueSeq().map(semester =>
                  <option key={semester.get('id')} value={semester.get('id')}>{semester.get('name')}</option>
                )}
              </Field>
            </div>
          </div>
        </div>
        <ActivityPointsTable
          fetchEventActivityDetails={fetchEventActivityDetails}
          student={student}
        />
      </div>
    );
  }
}

StudentActivityPointsTab = reduxForm({
  form: 'StudentActivityPointsTab',
})(StudentActivityPointsTab);

const selector = formValueSelector('StudentActivityPointsTab');

export default connect((state) => ({
  students: state.students.getIn(['admin', 'students']),
  semesterId: selector(state, 'semesterId'),
  semesters: state.semesters.semesters,
}), { ...actions, ...usersActions })(StudentActivityPointsTab);
