import { Record, Map, List } from 'immutable';
import parse from 'date-fns/parse';

import * as actions from './actions';
import * as userActions from '../users/actions';
import Student from './models/Student';

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
    case actions.CHANGE_STUDENTS_ACTIVITY_POINTS_SUCCESS:
    case actions.CHANGE_TUITION_FEE_SUCCESS:
    case actions.FETCH_ADMIN_STUDENTS_SUCCESS: {
      return state.setIn(['admin', 'students'], new Map(action.payload.map(student =>
        [student.id, new Map(new Student({
          ...student,
          activityPoints: new List(student.activityPoints.map(activity => new Map(activity))),
        }))]
      )));
    }

    case actions.ADD_ACTIVITY_POINTS_SUCCESS: {
      const activities = action.payload;
      return state.updateIn(['admin', 'students'], students => {
        let newStudents = students;
        activities.forEach(activity => {
          newStudents = newStudents.updateIn(
            [activity.studentId, 'activityPoints'],
            points => points.push(new Map(activity))
          );
        });

        return newStudents;
      });
    }

    case userActions.FETCH_STUDENT_SUCCESS: {
      const { studentId } = action.meta;
      return state.setIn(['admin', 'students', studentId], new Map(new Student({
        ...action.payload,
        activityPoints: new List(action.payload.activityPoints.map(activity => new Map(activity))),
      })));
    }

    case actions.DELETE_ACTIVITY_POINTS_SUCCESS: {
      const { studentId, activityPointsId } = action.meta;

      return state.updateIn(['admin', 'students'], students => {
        const activityIndex = students.getIn([studentId, 'activityPoints']).findIndex(activity =>
          activity.get('id') === activityPointsId
        );

        return students.updateIn(
          [studentId, 'activityPoints'],
          points => points.delete(activityIndex));
      });
    }

    case actions.FETCH_EVENT_ACTIVITY_DETAILS_SUCCESS: {
      const { studentId, eventId } = action.meta;

      return state.updateIn(['admin', 'students'], students => {
        const activityIndex = students.getIn([studentId, 'activityPoints']).findIndex(activity =>
          activity.get('activityType') === 'event' && activity.get('activityModelId') === eventId
        );

        return students.setIn(
          [studentId, 'activityPoints', activityIndex, 'details'],
          new Map(action.payload)
        );
      });
    }

    case actions.FETCH_STUDENT_COMMENTS_SUCCESS: {
      let newState = state.setIn(
        ['admin', 'activeStudentComments'],
        new Map(action.payload.map(comment =>
          [comment.id, new Map({
            ...comment,
            createdAt: parse(comment.createdAt),
            updatedAt: parse(comment.updatedAt),
            children: new Map(),
          })]
        )
      ));

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

    case actions.UPDATE_NOTE_COMMENT_SUCCESS: {
      const { id, title, body } = action.payload;

      return state.setIn(['admin', 'activeStudentComments', id, 'title'], title)
                  .setIn(['admin', 'activeStudentComments', id, 'body'], body);
    }

    case actions.DELETE_COMMENT_SUCCESS: {
      const commentId = action.meta.commentId;
      const comment = state.getIn(['admin', 'activeStudentComments', commentId]);

      let newState = state;
      const parentId = comment.get('parentId');
      if (parentId > 0) {
        newState = newState.deleteIn(
          ['admin', 'activeStudentComments', parentId, 'children', commentId]
        );
      }
      return newState.deleteIn(['admin', 'activeStudentComments', commentId]);
    }

    default: {
      return state;
    }
  }
}
