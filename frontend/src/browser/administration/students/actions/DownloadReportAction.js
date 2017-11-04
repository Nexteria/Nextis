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
          <form
            id="downloadStudentsReports"
            onSubmit={handleSubmit((data) => downloadStudentsReport(data))}
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
                  disabled={!reportType}
                >
                  Stiahnuť
                </button>
              </div>
            </div>
            {reportType ?
              <div className="col-md-12" style={styles.descriptionContainer}>
                Report obsahuje 2 sheety, <b>Študenti</b> a <b>Dáta</b>:
                <ul>
                  {reportType === 'signed-didnt-come' ?
                    <li>Študenti - obsahuje meno, priezvisko a email študenta.
                      Posledný stĺpec hovorí o tom, koľkokrát študent neprišiel
                      napriek tomu že bol prihlásený
                    </li>
                    : null
                  }
                  {reportType === 'late-unsigning' ?
                    <li>Študenti - obsahuje meno, priezvisko a email študenta.
                      Posledný stĺpec hovorí o tom, koľkokrát sa študent odhlásil
                      v "zakázanej zóne" pred začiatkom eventu
                    </li>
                    : null
                  }
                  <li>Dáta - pre každého študenta zoznam termínov, ktoré sa
                    zarátali do "Prehreškov".
                  </li>
                </ul>
              </div>
              : null
            }
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
