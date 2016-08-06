import { Record, Map } from 'immutable';
import shortid from 'shortid';

const Group = Record({
  uid: shortid.generate(),
  users: new Map(),
  name: '',
  createdBy: null,
  createdAt: null,
});

export default Group;
