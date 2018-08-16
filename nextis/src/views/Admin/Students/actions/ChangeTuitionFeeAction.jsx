import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';


import InputComponent from '../../../components/Input';
import * as usersActions from '../../../../common/users/actions';
import * as studentsActions from '../../../../common/students/actions';

class ChangeTuitionFeeAction extends Component {

  static propTypes = {
    hasPermission: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    changeTuitionFee: PropTypes.func.isRequired,
    selectedStudents: PropTypes.object,
  };

  render() {
    const {
      selectedStudents,
      changeTuitionFee,
      handleSubmit,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form
            id="changeTuitionFeeForm"
            onSubmit={handleSubmit((data) => changeTuitionFee(data, selectedStudents))}
          >
            <div className="col-md-12">
              <label>Vykonaním tejto akcie sa stane:</label>
              <ul>
                <li>označeným študentom sa zmení výška školného</li>
              </ul>
            </div>
            <div className="col-md-12">
              <Field
                name={'newFeeValue'}
                icon="€"
                contentCol="1"
                component={InputComponent}
                label={"Nová výška školného"}
              />
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-success"
                type="submit"
                form="changeTuitionFeeForm"
                disabled={!selectedStudents.size}
              >
                Zmeniť výšku školného
              </button>
            </div>
          </form>
          <div className="clearfix"></div>
        </div>
      </section>
    );
  }
}

ChangeTuitionFeeAction = reduxForm({
  form: 'ChangeTuitionFeeAction',
})(ChangeTuitionFeeAction);

export default connect(state => ({
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...usersActions, ...studentsActions })(ChangeTuitionFeeAction);
