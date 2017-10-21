import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';


import SelectComponent from '../../../components/Select';
import * as studentsActions from '../../../../common/students/actions';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  }
};

class DownloadReportAction extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    downloadStudentsReport: PropTypes.func.isRequired,
    reportType: PropTypes.string,
  };

  render() {
    const {
      downloadStudentsReport,
      handleSubmit,
      reportType,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form id="downloadStudentsReports" onSubmit={handleSubmit((data) => downloadStudentsReport(data))}>
            <div className="col-md-12" style={styles.container}>
              <div className="col-md-8">
                <Field
                  name={'reportType'}
                  component={SelectComponent}
                  label={"Typ reportu"}
                >
                  <option disabled></option>
                  <option value={'signed-didnt-come'}>Zoznam prihlásených, ktorí neprišli</option>
                  <option value={'late-unsigning'}>Zoznam neskoro sa odhlasujúcich</option>
                )}
                </Field>
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-primary"
                  type="submit"
                  form="downloadStudentsReports"
                  disabled={!reportType}
                >
                  Stiahnuť
                </button>
              </div>
            </div>
          </form>
          <div className="clearfix"></div>
        </div>
      </section>
    );
  }
}

DownloadReportAction = reduxForm({
  form: 'downloadStudentsReports',
})(DownloadReportAction);

const selector = formValueSelector('downloadStudentsReports');

export default connect(state => ({
  reportType: selector(state, 'reportType'),
}), studentsActions)(DownloadReportAction);
