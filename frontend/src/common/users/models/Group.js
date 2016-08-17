import { Record, Map } from 'immutable';

const Group = Record({
  id: null,
  users: new Map(),
  name: '',
  createdBy: null,
  createdAt: null,
});

export default Group;
