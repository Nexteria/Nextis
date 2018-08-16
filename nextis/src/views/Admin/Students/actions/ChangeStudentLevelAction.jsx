import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';


import SelectComponent from '../../../components/Select';
import * as usersActions from '../../../../common/users/actions';
import * as studentsActions from '../../../../common/students/actions';

class ChangeStudentLevelAction extends Component {

  static propTypes = {
    loadStudentLevelsList: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    studentLevels: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    changeStudentLevel: PropTypes.func.isRequired,
    selectedStudents: PropTypes.object,
  };

  componentDidMount() {
    const { loadStudentLevelsList } = this.props;
    loadStudentLevelsList();
  }

  render() {
    const {
      selectedStudents,
      changeStudentLevel,
      handleSubmit,
      studentLevels,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form id="changeStudentLevelForm" onSubmit={handleSubmit((data) => changeStudentLevel(data, selectedStudents))}>
            <div className="col-md-12">
              <label>Vykonaním tejto akcie sa stane:</label>
              <ul>
                <li>študentovi sa zmení jeho level</li>
                <li>v aktuálnom semestri študenta sa zmení jeho level</li>
                <li>študent sa presunie do levelovej skupiny</li>
              </ul>
            </div>
            <div className="col-md-12">
              <Field
                name={'studentLevelId'}
                normalize={value => parseInt(value, 10)}
                component={SelectComponent}
                label={"Level"}
              >
                <option disabled>Zvoľte level</option>
                {studentLevels.map(level =>
                  <option
                    value={level.get('id')}
                    key={level.get('id')}
                  >
                    {level.get('name')}
                  </option>
                )}
              )}
              </Field>
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-success"
                type="submit"
                form="changeStudentLevelForm"
                disabled={!selectedStudents.size}
              >
                Zmeniť level
              </button>
            </div>
          </form>
          <div className="clearfix"></div>
        </div>
      </section>
    );
  }
}

ChangeStudentLevelAction = reduxForm({
  form: 'ChangeStudentLevelAction',
})(ChangeStudentLevelAction);

export default connect(state => ({
  semesters: state.semesters.getIn(['admin', 'semesters']),
  studentLevels: state.users.studentLevels,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...usersActions, ...studentsActions })(ChangeStudentLevelAction);
