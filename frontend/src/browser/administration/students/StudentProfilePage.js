import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import RichTextEditor from 'react-rte';
import { browserHistory } from 'react-router';


import * as actions from '../../../common/students/actions';
import * as usersActions from '../../../common/users/actions';
import InputComponent from '../../components/Input';
import SelectComponent from '../../components/Select';
import TextEditor from '../../components/TextEditor';
import StudentNotesTab from './StudentNotesTab';
import StudentNotesFeed from './StudentNotesFeed';

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
  };

  componentDidMount() {
    const { initialize, params, students } = this.props;
    const studentId = params ? params.studentId : null;
    const student = students.get(parseInt(studentId, 10));

    initialize({
      ...student.toObject(),
      newComment: RichTextEditor.createValueFromString('', 'html'),
    });
  }

  renderEditor(data) {
    const { input, label, meta: { error } } = data;

    return (
      <div className={`form-group ${error ? 'has-error' : ''}`}>
        <label className="col-sm-12 control-label">
          {label}
        </label>
        <div className="col-sm-12">
          <TextEditor
            {...input}
          />
          <div className="has-error">
            {error && <label>{error}</label>}
          </div>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }

  render() {
    const { params, handleSubmit, children, initialized, students, studentStates, studentLevels } = this.props;

    if (!initialized) {
      return <div></div>;
    }

    const studentId = params ? parseInt(params.studentId, 10) : null;
    const student = students.get(studentId);

    const activeTab = params ? params.tab : 'basicInfo';

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
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...actions, ...usersActions })(StudentProfilePage);