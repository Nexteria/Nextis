import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';


import SelectComponent from '../../../components/Select';
import * as usersActions from '../../../../common/users/actions';
import * as studentsActions from '../../../../common/students/actions';

class ChangeStudentStatusAction extends Component {

  static propTypes = {
    studentStates: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    changeStudentStatus: PropTypes.func.isRequired,
    selectedStudents: PropTypes.object,
    reset: PropTypes.func.isRequired,
  };

  render() {
    const {
      selectedStudents,
      changeStudentStatus,
      studentStates,
      reset,
      handleSubmit,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form
            id="changeStudentStatusForm"
            onSubmit={handleSubmit((data) => {
              changeStudentStatus(data, selectedStudents);
              reset();
            })}
          >
            <div className="col-md-12">
              <label>Vykonaním tejto akcie sa stane:</label>
              <ul>
                <li>študentovi sa zmení jeho status</li>
              </ul>
            </div>
            <div className="col-md-12">
              <Field
                name={'status'}
                component={SelectComponent}
                label={"Nový status"}
              >
                <option value="" disabled>Zvoľte level</option>
                {studentStates ? Object.keys(studentStates).map((key) =>
                  <option value={studentStates[key]} key={key}>
                    {studentStates[key]}
                  </option>
                ) : null}
              </Field>
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-success"
                type="submit"
                form="changeStudentStatusForm"
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

const validate = (values) => {
  const errors = {};
  if (!values.status) {
    errors.status = 'Prosím vyberte status';
  }

  return errors;
};


ChangeStudentStatusAction = reduxForm({
  form: 'ChangeStudentStatusAction',
  validate,
})(ChangeStudentStatusAction);

export default connect(state => ({
  studentStates: state.app.constants.studentStates,
}), { ...usersActions, ...studentsActions })(ChangeStudentStatusAction);
