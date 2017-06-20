import { Record, Map } from 'immutable';

const Group = Record({
  id: null,
  users: new Map(),
  name: '',
  levelId: null,
  createdBy: null,
  createdAt: null,
});

export default Group;
