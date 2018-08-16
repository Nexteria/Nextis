import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { Link } from 'react-router';
import { connect } from 'react-redux';


import * as actions from '../../../../common/students/actions';
import FileUpload from '../../../components/FileUpload';

class ImportNewStudentsAction extends Component {

  static propTypes = {
    semesters: PropTypes.object,
    fields: PropTypes.object.isRequired,
    hasPermission: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    uploadNewStudentsExcel: PropTypes.func.isRequired,
    excelFile: PropTypes.object,
  };

  render() {
    const {
      handleSubmit,
      uploadNewStudentsExcel,
      excelFile,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form id="importNewStudentsAction" onSubmit={handleSubmit((data) => uploadNewStudentsExcel(data.newStudentsExcel))}>
            <div className="col-md-6">
              <label>Po nahratí súboru sa vykonajú tieto veci:</label>
              <ul>
                <li>overí sa, či údaje sú v správnom formáte a či už uživatelia neexistujú (ak nejaká kontrola neprejde, systém nevykoná nič)</li>
                <li>vytvoria sa uživateľské účty</li>
                <li>uživatelia sa priradia do skupiny "Novoprijatí študenti"</li>
                <li>vytvoria sa študenti k danym účtom</li>
                <li>študentom sa priradí 0.level</li>
                <li>študenti sa priradia do aktuálneho semestra</li>
                <li>ak bolo v exceli zaznačené, študentom sa odošle welcome email</li>
              </ul>

              <label>Veci ktoré možno chcete ďalej spraviť:</label>
              <ul>
                <li>piraradiť študentom iný level</li>
                <li>vytvoriť pre nových študentov ich "generačnú" skupinu (skupina do ktorej budu automaticky priradení sa mení každý rok, vlastná skupina je vhodná ak chcete o pár rokov adresovať tento ročník)</li>
              </ul>
            </div>
            <div className="col-md-6 text-center">
              <Link className="btn btn-primary" to={'/api/admin/templates/imports/newStudents'} target="_blank">
                <span>Stiahnuť excel na vyplnenie</span>
              </Link>

              <Field
                name="newStudentsExcel"
                component={FileUpload}
                accept="application/vnd.ms-excel"
                label="Vybrať excel so zoznamom študentov"
              />

              <button
                className="btn btn-success"
                type="submit"
                style={{ marginTop: '1em' }}
                form="importNewStudentsAction"
                disabled={!(excelFile && excelFile[0].name)}
              >
                Nahrať nových študentov
              </button>
            </div>
          </form>
          <div className="clearfix"></div>
        </div>
      </section>
    );
  }
}

ImportNewStudentsAction = reduxForm({
  form: 'ImportNewStudentsAction',
})(ImportNewStudentsAction);

const selector = formValueSelector('ImportNewStudentsAction');

export default connect(state => ({
  excelFile: selector(state, 'newStudentsExcel'),
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(ImportNewStudentsAction);
