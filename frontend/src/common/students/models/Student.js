import { Record, List } from 'immutable';

const Group = Record({
  activityPointsBaseNumber: null,
  firstName: '',
  id: null,
  userId: null,
  lastName: '',
  minimumSemesterActivityPoints: null,
  status: '',
  studentLevelId: null,
  sumGainedPoints: 0,
  sumPotentialPoints: 0,
  tuitionFeeBalance: 0,
  activityPoints: new List(),
});

export default Group;
