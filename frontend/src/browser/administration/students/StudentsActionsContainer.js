import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';


import SelectComponent from '../../components/Select';
import AssignNewSemesterAction from './actions/AssignNewSemesterAction';
import * as actions from '../../../common/students/actions';

class StudentsActionsContainer extends Component {

  static propTypes = {
    semesters: PropTypes.object,
    fields: PropTypes.object.isRequired,
    studentsAction: PropTypes.string.isRequired,
    hasPermission: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { studentsAction, selectedStudents } = this.props;

    const actionMap = new Map({
      no_action: <div></div>,
      assign_new_semester: <AssignNewSemesterAction {...{ selectedStudents }}/>,
    });

    return (
      <div className="students-actions-panel">
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <div className="box-header" style={{ minHeight: '4em' }}>
                  <h3 className="box-title">Akcie nad vybranými študentami ({selectedStudents.size})</h3>
                  <div className="box-tools">
                    <Field
                      name={'action'}
                      component={SelectComponent}
                      label={""}
                    >
                      <option value="no_action">Zvoľte akciu</option>
                      <option value="assign_new_semester">Priradiť nový semester</option>
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
