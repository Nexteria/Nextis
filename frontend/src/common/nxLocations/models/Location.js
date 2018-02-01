import { Record, List } from 'immutable';
import RichTextEditor from 'react-rte';

const Location = Record({
  id: null,
  name: '',
  instructions: RichTextEditor.createEmptyValue(),
  description: RichTextEditor.createEmptyValue(),
  userid: '',
  pictures: new List(),
  latitude: null,
  longitude: null,
  addressLine1: '',
  addressLine2: '',
  city: '',
  zipCode: '',
  countryCode: '',
  isMapVisible: false,
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
});

export default Location;
