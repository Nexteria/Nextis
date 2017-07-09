import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Map } from 'immutable';
import format from 'date-fns/format';
import isAfter from 'date-fns/is_after';


import * as actions from '../../../common/students/actions';
import * as usersActions from '../../../common/users/actions';
import confirmAction from '../../components/ConfirmAction';
import StudentNotesComment from './StudentNotesComment';


const styles = {
  deleteIcon: {
    marginLeft: '1em',
    cursor: 'pointer',
  }
};

class StudentNotesFeed extends Component {

  static propTypes = {
    comments: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    studentId: PropTypes.number.isRequired,
    hasPermission: PropTypes.func.isRequired,
    fetchStudentComments: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialized: PropTypes.bool.isRequired,
    createNoteComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { studentId, fetchStudentComments } = this.props;

    fetchStudentComments(studentId);
  }

  renderCommentInput(data) {
    const { input, commentId, change, createNoteComment } = data;

    return (
      <div className="input-group">
        <input type="text" placeholder="Napíšte komentár ..." className="form-control" {...input} />
        <span className="input-group-btn">
          <button
            onClick={() => {
              createNoteComment(input.value, commentId);
              change(input.name, '');
            }}
            className="btn btn-success btn-flat">Odoslať</button>
        </span>
      </div>
    );
  }

  render() {
    const { comments, users, change, createNoteComment, deleteComment } = this.props;

    let dayComments = new Map();

    comments.filter(comment => !comment.get('parentId'))
      .sort((a, b) => isAfter(a.createdAt, b.createdAt) ? -1 : 1)
      .forEach(comment => {
        const day = format(comment.get('createdAt'), 'D. MMM YYYY');
        dayComments = dayComments.setIn([day, comment.get('id')], comment);
      });

    return (
      <div className="col-md-12">
        {dayComments
          .map((actualComments, day) =>
            <ul className="timeline">
              <li className="time-label">
                <span className="bg-red">
                  {day}
                </span>
              </li>
              {actualComments.map(comment =>
                <li>
                  <i className="fa fa-envelope bg-blue"></i>
                  <div className="timeline-item">
                    <span className="time">
                      <i className="fa fa-clock-o"></i> {format(comment.get('createdAt'), 'HH:mm')}
                      <span>, {users.getIn([comment.get('creatorId'), 'firstName'])} {users.getIn([comment.get('creatorId'), 'lastName'])}</span>
                      <i
                        className="fa fa-trash"
                        style={styles.deleteIcon}
                        onClick={() => confirmAction(
                          'Ste si istý, že chcete zmazať túto poznámku?',
                          () => deleteComment(comment.get('id')),
                          null
                        )}
                      ></i>
                    </span>

                    <h3 className="timeline-header"><a>{comment.get('title')}</a>&nbsp;</h3>

                    <div
                      className="timeline-body"
                      dangerouslySetInnerHTML={{ __html: comment.get('body') }}
                    ></div>

                    {comment.get('children').size ?
                      <div className="box-footer box-comments">
                        {comment.get('children')
                          .sort((a, b) => isAfter(a.createdAt, b.createdAt) ? 1 : -1)
                          .map(children =>
                            <StudentNotesComment users={users} comment={comments.get(children)} deleteComment={deleteComment} />
                        )}
                      </div>
                      : null
                    }
                    <div className="timeline-footer">
                      <Field
                        name={`comments.note_${comment.get('id')}`}
                        component={this.renderCommentInput}
                        change={change}
                        commentId={comment.get('id')}
                        createNoteComment={createNoteComment}
                      />
                    </div>
                  </div>
                </li>
              )}
            </ul>
          )}
      </div>
    );
  }
}

StudentNotesFeed = reduxForm({
  form: 'StudentNotesFeed',
})(StudentNotesFeed);

export default connect(state => ({
  comments: state.students.getIn(['admin', 'activeStudentComments']),
  users: state.users.get('users'),
  initialValues: { comments: {}},
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...actions, ...usersActions })(StudentNotesFeed);
