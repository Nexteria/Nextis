import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';


import SelectComponent from '../../../components/Select';
import InputComponent from '../../../components/Input';
import * as studentsActions from '../../../../common/students/actions';
import * as semesterActions from '../../../../common/semesters/actions';

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

const studentsActiveSemesterPointsDescription = (
  <div>
    <span>Report obsahuje pre zvolený semester, pre každého študenta tieto informácie:</span>
    <ul>
      <li>meno, priezvisko, level, email</li>
      <li>bodový základ</li>
      <li>bodové minimum</li>
      <li>počet bodov</li>
      <li>počet potencionálnych bodov - eventy na, ktorých študent má zaznačenú prítomnosť,
         ale nemá vyplnený feedback
      </li>
    </ul>
  </div>
);

const studentsActiveSemesterAttendanceDescription = (
  <div>
    <span>Report obsahuje zaznamy o vsetkych pozvanych studentoch na stretnutiach a eventoch a informácie:</span>
    <ul>
      <li>Meno a priezvisko</li>
      <li>Level</li>
      <li>Názov eventu</li>
      <li>Dátum stretnutia</li>
      <li>Či bol študent prihlásený, odhlásený alebo dal vedieť, že nepríde</li>
      <li>Či daný študent bol na stretnutí a či vyplnil feedback</li>
    </ul>
  </div>
);

class DownloadReportAction extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    downloadStudentsReport: PropTypes.func.isRequired,
    reportType: PropTypes.string,
    selectedStudents: PropTypes.object,
    fetchAdminSemesters: PropTypes.func.isRequired,
    semesters: PropTypes.object,
  };

  componentDidMount() {
    const { fetchAdminSemesters } = this.props;
    fetchAdminSemesters();
  }

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
      semesters,
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
                  <option value={'students-semester-points'}>Prehľad bodov študentov</option>
                  <option value={'students-active-semester-attendance'}>Prehľad účasti študentov</option>
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
                {reportType === 'late-unsigning' || reportType === 'signed-didnt-come' || reportType === 'students-semester-points' ?
                  <Field
                    name={'semesterId'}
                    normalize={value => parseInt(value, 10)}
                    component={SelectComponent}
                    label={"Semester"}
                  >
                    {semesters.map(semester =>
                      <option
                        value={semester.get('id')}
                        key={semester.get('id')}
                      >
                        {semester.get('name')}
                      </option>
                    )}
                  )}
                  </Field>
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
              {reportType === 'students-semester-points' ? studentsActiveSemesterPointsDescription : null}
              {reportType === 'students-active-semester-attendance' ? studentsActiveSemesterAttendanceDescription : null}
              
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
  semesters: state.semesters.getIn(['admin', 'semesters']),
  initialValues: {
    hoursBeforeEvent: 24,
    semesterId: state.semesters.get('activeSemesterId'),
  },
}), { ...studentsActions, ...semesterActions })(DownloadReportAction);
