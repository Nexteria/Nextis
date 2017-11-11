import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import format from 'date-fns/format';


import Avatar from '../../components/Avatar';
import confirmAction from '../../components/ConfirmAction';


const styles = {
  deleteIcon: {
    marginLeft: '1em',
    cursor: 'pointer',
  }
};

export default class StudentNotesComment extends Component {

  static propTypes = {
    comment: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    deleteComment: PropTypes.func.isRequired,
  };

  render() {
    const { comment, user, deleteComment } = this.props;

    return (
      <div className="box-comment">
        <Avatar />
        <div className="comment-text">
          <span className="username">
            {`${user.get('firstName')} ${user.get('lastName')}`}
            <span className="text-muted pull-right">
              {format(comment.get('createdAt'), 'D.M.YYYY HH:mm')}
              <i
                className="fa fa-trash"
                style={styles.deleteIcon}
                onClick={() => confirmAction(
                  'Ste si istý, že chcete zmazať tento komentár?',
                  () => deleteComment(comment.get('id')),
                  null
                )}
              ></i>
            </span>
          </span>
          {comment.get('body')}
        </div>
      </div>
    );
  }
}
