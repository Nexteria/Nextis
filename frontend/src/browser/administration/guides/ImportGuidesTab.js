import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';

import * as actions from '../../../common/guides/actions';
import FileUpload from '../../components/FileUpload';

class ImportGuidesTab extends Component {
  static propTypes = {
    excelFile: PropTypes.object,
    uploadNewGuidesExcel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { handleSubmit, excelFile, uploadNewGuidesExcel } = this.props;

    return (
      <div className="text-center">
        <form
          id="ImportGuidesTab"
          onSubmit={handleSubmit((data) => uploadNewGuidesExcel(data.newGuidesFile))}
        >
          <Field
            name="newGuidesFile"
            component={FileUpload}
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            label="Vybrať excel so zoznamom guidov"
          />

          <button
            className="btn btn-success"
            type="submit"
            style={{ marginTop: '1em' }}
            form="ImportGuidesTab"
            disabled={!(excelFile && excelFile[0].name)}
          >
            Nahrať nových guidov
          </button>
        </form>
        <div className="clearfix"></div>
      </div>
    );
  }
}

ImportGuidesTab = reduxForm({
  form: 'ImportGuidesTab',
})(ImportGuidesTab);

const selector = formValueSelector('ImportGuidesTab');

export default connect(state => ({
  excelFile: selector(state, 'newGuidesFile'),
}), { ...actions })(ImportGuidesTab);
