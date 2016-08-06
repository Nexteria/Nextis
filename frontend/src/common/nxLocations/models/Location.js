import { Record } from 'immutable';
import shortid from 'shortid';

const Location = Record({
  uid: shortid.generate(),
  name: '',
  instructions: '',
  description: '',
  userUid: '',
  photo: '',
  latitude: '',
  longitude: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  zipCode: '',
  countryCode: '',
});

export default Location;
