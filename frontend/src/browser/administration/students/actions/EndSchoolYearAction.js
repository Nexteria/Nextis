import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';


import * as actions from '../../../../common/students/actions';

class EndSchoolYearAction extends Component {

  static propTypes = {
    semesters: PropTypes.object,
    fields: PropTypes.object.isRequired,
    endSchoolYear: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    const {
      handleSubmit,
      endSchoolYear,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form id="endSchoolYear" onSubmit={handleSubmit(() => endSchoolYear())}>
            <div className="col-md-12">
              <label>Vykonaním tejto akcie sa stane:</label>
              <ul>
                <li>premiestnia sa všetci <b>študenti</b>, ktorí majú nastavení status na <b>aktívny</b>, z aktuálnej levelovej (1.,2.,3.) skupiny do nasledujúcej (2.,3.,alumni)</li>
                <li>študentom z predchádzajúceho kroku sa nastaví level o jeden vyšší</li>
                <li>akcia sa vykoná nezávisle na výbere študentov v zozname</li>
              </ul>
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-success"
                type="submit"
                form="endSchoolYear"
              >
                Ukončiť školský rok
              </button>
            </div>
          </form>
          <div className="clearfix"></div>
        </div>
      </section>
    );
  }
}

EndSchoolYearAction = reduxForm({
  form: 'EndSchoolYear',
})(EndSchoolYearAction);

export default connect(state => ({
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(EndSchoolYearAction);
