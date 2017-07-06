import { Record, Map } from 'immutable';
import parse from 'date-fns/parse';

import * as actions from './actions';

const InitialState = Record({
  admin: new Map({
    students: new Map({}),
    activeStudentComments: new Map({}),
  })
}, 'students');

export default function studentsReducer(state = new InitialState, action) {
  switch (action.type) {

    case actions.END_SCHOOL_YEAR_SUCCESS:
    case actions.UPLOAD_NEW_STUDENTS_EXCEL_SUCCESS:
    case actions.CHANGE_STUDENT_LEVEL_SUCCESS:
    case actions.FETCH_ADMIN_STUDENTS_SUCCESS: {
      return state.setIn(['admin', 'students'], new Map(action.payload.map(student =>
        [student.id, new Map(student)]
      )));
    }

    case actions.FETCH_STUDENT_COMMENTS_SUCCESS: {
      let newState = state.setIn(['admin', 'activeStudentComments'], new Map(action.payload.map(comment =>
        [comment.id, new Map({
          ...comment,
          createdAt: parse(comment.createdAt),
          updatedAt: parse(comment.updatedAt),
          children: new Map(),
        })]
      )));

      action.payload.forEach(comment => {
        if (comment.parentId) {
          newState = newState.updateIn(
            ['admin', 'activeStudentComments', comment.parentId, 'children'],
            children => children.set(comment.id, comment.id)
          );
        }
      });

      return newState;
    }

    case actions.CREATE_STUDENT_NOTE_COMMENT_SUCCESS:
    case actions.CREATE_STUDENT_COMMENT_SUCCESS: {
      const comment = action.payload;
      let newState = state.setIn(['admin', 'activeStudentComments', comment.id], new Map({
        ...comment,
        createdAt: parse(comment.createdAt),
        updatedAt: parse(comment.updatedAt),
        children: new Map(),
      }));

      if (comment.parentId) {
        newState = newState.updateIn(
          ['admin', 'activeStudentComments', comment.parentId, 'children'],
          children => children.set(comment.id, comment.id)
        );
      }

      return newState;
    }

    default: {
      return state;
    }
  }
}
