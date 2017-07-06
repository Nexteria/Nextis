import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import RichTextEditor from 'react-rte';
import format from 'date-fns/format';


import * as actions from '../../../common/students/actions';
import * as usersActions from '../../../common/users/actions';
import TextEditor from '../../components/TextEditor';
import InputComponent from '../../components/Input';

class StudentNotesTab extends Component {

  static propTypes = {
    student: PropTypes.object.isRequired,
    initialize: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    createStudentComment: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialized: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { initialize } = this.props;

    initialize({
      newCommentBody: RichTextEditor.createValueFromString('', 'html'),
      newCommentTitle: '',
    });
  }

  renderEditor(data) {
    const { input, label, meta: { error } } = data;

    return (
      <div className={`form-group ${error ? 'has-error' : ''}`}>
        <label className="col-sm-12 control-label">
          {label}
        </label>
        <div className="col-sm-12">
          <TextEditor
            {...input}
          />
          <div className="has-error">
            {error && <label>{error}</label>}
          </div>
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }

  render() {
    const { student, initialized, handleSubmit, createStudentComment } = this.props;

    if (!initialized) {
      return <div></div>;
    }

    return (
      <form id="newCommentForm" onSubmit={handleSubmit(data => createStudentComment(data, student.get('id')))}>
        <Field
          name={'newCommentTitle'}
          component={InputComponent}
          label="Predmet poznámky"
          type="text"
        />
        <Field
          name={'newCommentBody'}
          component={this.renderEditor}
          label="Správa poznámky"
        />
        <button
          className="btn btn-success pull-right"
          type="submit"
          form="newCommentForm"
        >
            Vytvoriť novú poznámku
        </button>
        <div className="clearfix"></div>
      </form>
    );
  }
}

StudentNotesTab = reduxForm({
  form: 'StudentNotesTab',
})(StudentNotesTab);

export default connect(state => ({
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...actions, ...usersActions })(StudentNotesTab);
