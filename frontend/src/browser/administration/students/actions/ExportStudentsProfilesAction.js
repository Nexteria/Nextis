import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


import * as actions from '../../../../common/students/actions';

class ExportStudentsProfilesAction extends Component {

  static propTypes = {
    exportStudentsProfiles: PropTypes.func.isRequired,
    selectedStudents: PropTypes.object.isRequired,
  };

  render() {
    const {
      selectedStudents,
      exportStudentsProfiles,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <div className="col-md-12 text-center">
            <button
              className="btn btn-success"
              type="submit"
              onClick={() => exportStudentsProfiles(selectedStudents)}
            >
              Export vybraných študentov
            </button>
          </div>
          <div className="clearfix"></div>
        </div>
      </section>
    );
  }
}

export default connect(state => ({
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(ExportStudentsProfilesAction);
