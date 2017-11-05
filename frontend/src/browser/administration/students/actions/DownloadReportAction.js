import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';


import SelectComponent from '../../../components/Select';
import InputComponent from '../../../components/Input';
import * as studentsActions from '../../../../common/students/actions';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  descriptionContainer: {
    marginTop: '2em',
  },
};

const signedDidntComeDescription = (
  <div>
    <span>Report obsahuje 2 sheety, <b>Študenti</b> a <b>Dáta</b>:</span>
    <ul>
      <li>Študenti - obsahuje meno, priezvisko a email študenta.
        Posledný stĺpec hovorí o tom, koľkokrát študent neprišiel
        napriek tomu že bol prihlásený
      </li>
      <li>Dáta - pre každého študenta zoznam termínov, ktoré sa
        zarátali do "Prehreškov".
      </li>
    </ul>
  </div>
);

const lateUnsigningDescription = (
  <div>
    <span>Report obsahuje 2 sheety, <b>Študenti</b> a <b>Dáta</b>:</span>
    <ul>
      <li>Študenti - obsahuje meno, priezvisko a email študenta.
        Posledný stĺpec hovorí o tom, koľkokrát sa študent odhlásil
        v "zakázanej zóne" pred začiatkom eventu
      </li>
      <li>Dáta - pre každého študenta zoznam termínov, ktoré sa
        zarátali do "Prehreškov".
      </li>
    </ul>
  </div>
);

const studentSemesterPointsDescription = (
  <div>
    <span>Report obsahuje pre každý semester:</span>
    <ul>
      <li>% získaných bodov</li>
      <li>Vynechané levelové aktivity (iba pre aktivity ktoré už boli)</li>
      <li>Aktivity na ktoré sa prihlásil, ale neprišiel</li>
    </ul>
  </div>
);

class DownloadReportAction extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    downloadStudentsReport: PropTypes.func.isRequired,
    reportType: PropTypes.string,
    selectedStudents: PropTypes.object,
  };

  disableDownloadButton(reportType, selectedStudents) {
    let disable = false;
    if (!reportType) {
      disable = true;
    } else {
      if (reportType === 'student-semesters-points' && selectedStudents.size !== 1) {
        disable = true;
      }
    }

    return disable;
  }

  render() {
    const {
      downloadStudentsReport,
      handleSubmit,
      reportType,
      selectedStudents,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form
            id="downloadStudentsReports"
            onSubmit={handleSubmit((data) => downloadStudentsReport(data, selectedStudents))}
          >
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
                  <option value={'student-semesters-points'}>Prehľad aktivít študenta</option>
                )}
                </Field>
                {reportType === 'late-unsigning' ?
                  <Field
                    name={'hoursBeforeEvent'}
                    component={InputComponent}
                    type="number"
                    label={"Zakázaný počet hodín pred eventom"}
                  />
                  : null
                }
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-primary"
                  type="submit"
                  form="downloadStudentsReports"
                  disabled={this.disableDownloadButton(reportType, selectedStudents)}
                >
                  Stiahnuť
                </button>
              </div>
            </div>
            <div className="col-md-12 text-danger">
              {reportType === 'student-semesters-points' && selectedStudents.size !== 1 ?
                'Prosím vyber práve 1 študenta' : null
              }
            </div>
            <div className="col-md-12" style={styles.descriptionContainer}>
              {reportType === 'signed-didnt-come' ? signedDidntComeDescription : null}
              {reportType === 'late-unsigning' ? lateUnsigningDescription : null}
              {reportType === 'student-semesters-points' ? studentSemesterPointsDescription : null}
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
  initialValues: {
    hoursBeforeEvent: 24,
  },
}), studentsActions)(DownloadReportAction);
