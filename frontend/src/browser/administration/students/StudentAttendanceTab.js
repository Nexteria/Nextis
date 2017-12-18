import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { formValueSelector, Field, reduxForm } from 'redux-form';


import * as actions from '../../../common/students/actions';
import * as usersActions from '../../../common/users/actions';
import * as eventActions from '../../../common/events/actions';
import AttendeesTable from '../../activityPoints/AttendeesTable';
import SelectComponent from '../../components/Select';


const styles = {
  semesterSelector: {
    maxWidth: '220px',
    margin: 'auto',
    marginBottom: '10px',
  },
};


class StudentAttendanceTab extends Component {

  static propTypes = {
    viewerSemesters: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    getEventsAttendeesForUser: PropTypes.func.isRequired,
    viewer: PropTypes.object.isRequired,
    attendees: PropTypes.object,
    initialized: PropTypes.bool.isRequired,
  };

  render() {
    const {
      getEventsAttendeesForUser,
      semesterId,
      attendees,
      semesters,
      initialized,
      userId,
    } = this.props;

    if (!initialized) {
      return <div></div>;
    }

    return (
      <div>
        <div className="row text-center">
          <div className="form-group">
            <Field
              name={'semesterId'}
              component={SelectComponent}
              style={styles.semesterSelector}
              label="Semester"
              normalize={value => {
                getEventsAttendeesForUser(userId, value);
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
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <div className="box-body table-responsive no-padding">
                <div className="col-md-12">
                  {semesterId ?
                    <div>
                      {!attendees ?
                        <div>Načítavam</div>
                      :
                        <AttendeesTable {...{ attendees }} />
                      }
                      <div className="clearfix"></div>
                    </div>
                    : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

StudentAttendanceTab = reduxForm({
  form: 'StudentAttendanceTabForm',
})(StudentAttendanceTab);

const selector = formValueSelector('StudentAttendanceTabForm');

export default connect((state) => ({
  semesterId: selector(state, 'semesterId'),
  semesters: state.semesters.semesters,
  initialValues: {
    semesterId: 0,
  },
  attendees: state.events.attendees,
}), { ...actions, ...usersActions, ...eventActions })(StudentAttendanceTab);
