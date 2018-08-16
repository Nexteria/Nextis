import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';


import InputComponent from '../../../components/Input';
import * as usersActions from '../../../../common/users/actions';
import * as studentsActions from '../../../../common/students/actions';

class ChangeActivityPointsAction extends Component {

  static propTypes = {
    hasPermission: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    changeStudentActivityPoints: PropTypes.func.isRequired,
    selectedStudents: PropTypes.object,
  };

  render() {
    const {
      selectedStudents,
      changeStudentActivityPoints,
      handleSubmit,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form
            id="changeStudentActivityPointsForm"
            onSubmit={handleSubmit((data) => changeStudentActivityPoints(data, selectedStudents))}
          >
            <div className="col-md-12">
              <Field
                name={'activityPointsBaseNumber'}
                type="number"
                component={InputComponent}
                label={'Bodový základ'}
              />
            </div>
            <div className="col-md-12">
              <Field
                name={'minimumSemesterActivityPoints'}
                type="number"
                component={InputComponent}
                label={'Minimum bodov'}
              />
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-success"
                type="submit"
                form="changeStudentActivityPointsForm"
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

ChangeActivityPointsAction = reduxForm({
  form: 'ChangeActivityPointsAction',
})(ChangeActivityPointsAction);

export default connect(state => ({
  studentLevels: state.users.studentLevels,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...usersActions, ...studentsActions })(ChangeActivityPointsAction);
