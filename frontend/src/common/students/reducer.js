import { Record, Map } from 'immutable';

import * as actions from './actions';

const InitialState = Record({
  admin: new Map({
    students: new Map({}),
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

    default: {
      return state;
    }
  }
}
