import { Record } from 'immutable';

const StudentLevel = Record({
  id: null,
  name: '',
  description: '',
  ownerId: null,
  defaultTuitionFee: 0,
  defaultActivityPointsBaseNumber: 0,
  defaultMinimumSemesterActivityPoints: 0,
  created_at: null,
  updated_at: null,
});

export default StudentLevel;
