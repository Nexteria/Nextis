import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';


import SelectComponent from '../../components/Select';
import AssignNewSemesterAction from './actions/AssignNewSemesterAction';
import EndSchoolYearAction from './actions/EndSchoolYearAction';
import ImportNewStudentsAction from './actions/ImportNewStudentsAction';
import ChangeStudentLevelAction from './actions/ChangeStudentLevelAction';
import ChangeTuitionFeeAction from './actions/ChangeTuitionFeeAction';
import AddNoteAction from './actions/AddNoteAction';
import ExportStudentsProfilesAction from './actions/ExportStudentsProfilesAction';
import ChangeActivityPointsAction from './actions/ChangeActivityPointsAction';
import DownloadReportAction from './actions/DownloadReportAction';
import ChangeStudentStatusAction from './actions/ChangeStudentStatusAction';

import * as actions from '../../../common/students/actions';
import AddActivityPoints from './actions/AddActivityPoints';

class StudentsActionsContainer extends Component {

  static propTypes = {
    semesters: PropTypes.object,
    studentsAction: PropTypes.string,
    hasPermission: PropTypes.func.isRequired,
    selectedStudents: PropTypes.object,
  };

  render() {
    const { studentsAction, selectedStudents } = this.props;

    const actionMap = new Map({
      no_action: <div></div>,
      assign_new_semester: <AssignNewSemesterAction {...{ selectedStudents }} />,
      end_school_year: <EndSchoolYearAction {...{ selectedStudents }} />,
      import_new_students: <ImportNewStudentsAction {...{ selectedStudents }} />,
      change_student_level: <ChangeStudentLevelAction {...{ selectedStudents }} />,
      add_student_note: <AddNoteAction {...{ selectedStudents }} />,
      export_students_profiles: <ExportStudentsProfilesAction {...{ selectedStudents }} />,
      change_tuition_fee: <ChangeTuitionFeeAction {...{ selectedStudents }} />,
      change_activity_point: <ChangeActivityPointsAction {...{ selectedStudents }} />,
      download_students_reports: <DownloadReportAction {...{ selectedStudents }} />,
      add_activity_points: <AddActivityPoints {...{ selectedStudents }} />,
      change_student_status: <ChangeStudentStatusAction {...{ selectedStudents }} />,
    });

    return (
      <div className="students-actions-panel">
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <div className="box-header" style={{ minHeight: '4em' }}>
                  <h3 className="box-title">
                    Akcie nad vybranými študentami ({selectedStudents ? selectedStudents.size : 0})
                  </h3>
                  <div className="box-tools">
                    <Field
                      name={'action'}
                      component={SelectComponent}
                      label={""}
                    >
                      <option value="no_action">Zvoľte akciu</option>
                      <option value="assign_new_semester">Priradiť nový semester</option>
                      <option value="end_school_year">Ukončiť školský rok</option>
                      <option value="import_new_students">Nahrať nových študentov</option>
                      <option value="change_student_level">Zmena levelu študenta</option>
                      <option value="add_student_note">Pridať študentom poznámku</option>
                      <option value="export_students_profiles">Export študentských profilov</option>
                      <option value="change_tuition_fee">Zmena výšky školného</option>
                      <option value="change_activity_point">Zmena základu aktivity bodov</option>
                      <option value="download_students_reports">Stiahnuť reporty</option>
                      <option value="add_activity_points">Pridať aktivity body</option>
                      <option value="change_student_status">Zmeniť status študenta</option>
                    )}
                    </Field>
                  </div>
                </div>
                <div className="box-body no-padding">
                  {actionMap.get(studentsAction)}
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

StudentsActionsContainer = reduxForm({
  form: 'studentsActionsContainer',
})(StudentsActionsContainer);

const selector = formValueSelector('studentsActionsContainer');

export default connect(state => ({
  students: state.students.getIn(['admin', 'students']),
  studentsAction: selector(state, 'action'),
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(StudentsActionsContainer);
