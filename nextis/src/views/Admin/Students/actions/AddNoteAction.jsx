import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import RichTextEditor from 'react-rte';


import InputComponent from '../../../components/Input';
import TextEditor from '../../../components/TextEditor';
import * as actions from '../../../../common/students/actions';

class AddNoteAction extends Component {

  static propTypes = {
    createBulkStudentsComment: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    selectedStudents: PropTypes.object.isRequired,
  };

  render() {
    const {
      selectedStudents,
      reset,
      handleSubmit,
      createBulkStudentsComment,
    } = this.props;

    return (
      <section className="content">
        <div className="row">
          <form
            id="createStudentNotesForm"
            onSubmit={handleSubmit((data) =>
              createBulkStudentsComment(data, selectedStudents).then(reset)
            )}
          >
            <div className="col-md-12">
              <Field
                name={'newCommentTitle'}
                type="text"
                component={InputComponent}
                label={'Predmet poznámky'}
              />
              <Field
                name={'newCommentBody'}
                component={TextEditor}
                label="Správa poznámky"
              />
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-success"
                type="submit"
                form="createStudentNotesForm"
              >
                Vytvoriť poznámku
              </button>
            </div>
          </form>
          <div className="clearfix"></div>
        </div>
      </section>
    );
  }
}

AddNoteAction = reduxForm({
  form: 'AddNoteAction',
})(AddNoteAction);

export default connect(state => ({
  initialValues: {
    newCommentBody: RichTextEditor.createValueFromString('', 'html'),
    newCommentTitle: '',
  },
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(AddNoteAction);
