import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import { browserHistory } from 'react-router';


import * as actions from '../../../common/students/actions';
import * as usersActions from '../../../common/users/actions';
import InputComponent from '../../components/Input';
import SelectComponent from '../../components/Select';
import StudentNotesTab from './StudentNotesTab';
import StudentNotesFeed from './StudentNotesFeed';
import StudentActivityPointsTab from './StudentActivityPointsTab';
import StudentAttendanceTab from './StudentAttendanceTab';
import ActivityPointsEditDialog from '../../activityPoints/ActivityPointsEditDialog';

class StudentProfilePage extends Component {

  static propTypes = {
    students: PropTypes.object.isRequired,
    studentLevels: PropTypes.object.isRequired,
    fetchAdminStudents: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    studentStates: PropTypes.object.isRequired,
    initialized: PropTypes.bool.isRequired,
    createStudentComment: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    loadUserSemesters: PropTypes.func.isRequired,
    activeSemesterId: PropTypes.number,
  };

  componentDidMount() {
    const { initialize, params, loadUserSemesters, students } = this.props;
    const studentId = params ? params.studentId : null;
    const student = students.get(parseInt(studentId, 10));

    initialize({
      ...student.toObject(),
    });
    loadUserSemesters(student.get('userId'));
  }

  render() {
    const {
      params,
      handleSubmit,
      children,
      initialized,
      students,
      studentStates,
      studentLevels,
      activeSemesterId,
    } = this.props;

    if (!initialized) {
      return <div></div>;
    }

    const studentId = params ? parseInt(params.studentId, 10) : null;
    const student = students.get(studentId);

    const activeTab = params ? params.tab : 'basicInfo';
    const activeModelId = params ? parseInt(params.modelId, 10) : '';

    return (
      <div>
        <section className="content">
          <div className="row">
            <div className="col-md-3">
              <div className="box box-primary">
                <div className="box-body box-profile">
                  <i className="fa fa-user avatar-icon-profile"></i>

                  <h3 className="profile-username text-center">
                    {`${student.get('firstName')} ${student.get('lastName')}`}
                  </h3>
                  <h4 className="text-center">
                    {studentLevels.get(student.get('studentLevelId')).name}
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <Tabs
                activeKey={activeTab}
                id="users-info-tabs"
                className="nav-tabs-custom"
                onSelect={(eventKey) => browserHistory.push(`/admin/students/${studentId}/${eventKey}`)}
              >
                <Tab
                  eventKey={'basicInfo'}
                  title="Základné info"
                >
                  <form onSubmit={handleSubmit(data => console.log(''))}>
                    <Field
                      name={'firstName'}
                      type="text"
                      component={InputComponent}
                      label={'Meno'}
                      readOnly
                    />
                    <Field
                      name={'lastName'}
                      type="text"
                      component={InputComponent}
                      label={'Priezvisko'}
                      readOnly
                    />
                    <Field
                      name={'status'}
                      normalize={value => parseInt(value, 10)}
                      component={SelectComponent}
                      label={"Stav"}
                      readOnly
                    >
                      {studentStates ? Object.keys(studentStates).map((key) =>
                        <option value={studentStates[key]} key={key}>
                          {studentStates[key]}
                        </option>
                      ) : null}
                    </Field>
                  </form>
                </Tab>
                <Tab
                  eventKey={'feed'}
                  title="Feed"
                >
                </Tab>
                <Tab
                  eventKey={'notes'}
                  title="Poznámky"
                  mountOnEnter
                >
                  <StudentNotesTab student={student} />
                </Tab>
                <Tab
                  eventKey={'activityPoints'}
                  title="Aktivity body"
                  mountOnEnter
                >
                  <StudentActivityPointsTab student={student} />
                  {activeTab === 'activityPoints' && activeModelId ?
                    <ActivityPointsEditDialog activityId={activeModelId} student={student} />
                    : null
                  }
                </Tab>
                <Tab
                  eventKey={'attendance'}
                  title="Účasť"
                  mountOnEnter
                >
                  {activeSemesterId ?
                    <StudentAttendanceTab userId={student.get('userId')} /> : null
                  }
                </Tab>
              </Tabs>
            </div>
            {activeTab === 'notes' && <StudentNotesFeed studentId={studentId} />}
          </div>
        </section>
      </div>
    );
  }
}

StudentProfilePage = reduxForm({
  form: 'StudentProfilePageForm',
})(StudentProfilePage);

export default connect(state => ({
  students: state.students.getIn(['admin', 'students']),
  studentStates: state.app.constants.studentStates,
  studentLevels: state.users.studentLevels,
  activeSemesterId: state.semesters.activeSemesterId,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...actions, ...usersActions })(StudentProfilePage);
