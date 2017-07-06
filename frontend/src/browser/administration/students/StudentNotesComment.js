import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import format from 'date-fns/format';


import Avatar from '../../components/Avatar';

export default class StudentNotesComment extends Component {

  static propTypes = {
    comment: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
  };

  render() {
    const { comment, users } = this.props;

    return (
      <div className="box-comment">
        <Avatar />
        <div className="comment-text">
          <span className="username">
            {users.getIn([comment.get('creatorId'), 'firstName'])}
            {` ${users.getIn([comment.get('creatorId'), 'lastName'])}`}
            <span className="text-muted pull-right">
              {format(comment.get('createdAt'), 'D.M.YYYY HH:mm')}
            </span>
          </span>
          {comment.get('body')}
        </div>
      </div>
    );
  }
}
