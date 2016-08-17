import { Record, Map } from 'immutable';

const Role = Record({
  id: null,
  name: '',
  display_name: '',
  description: '',
  permissions: new Map(),
  created_at: null,
  updated_at: null,
});

export default Role;
