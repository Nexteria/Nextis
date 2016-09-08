import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';
import Dropzone from 'react-dropzone';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { Field, Fields, reduxForm, formValueSelector } from 'redux-form';
import validator from 'validator';


import { fields } from '../../common/lib/redux-fields/index';
import NextLocation from '../../common/nxLocations/models/Location';
import * as fieldActions from '../../common/lib/redux-fields/actions';
import TextEditor from '../components/TextEditor';
import * as pictureActions from '../../common/picturesUpload/actions';
import * as locationsActions from '../../common/nxLocations/actions';
import './CreateLocationDialog.scss';

const messages = defineMessages({
  saveLocationButton: {
    defaultMessage: 'Save',
    id: 'location.edit.saveLocationButton',
  },
  locationName: {
    defaultMessage: 'Location name',
    id: 'location.edit.locationName',
  },
  createLocationTitle: {
    defaultMessage: 'Create location',
    id: 'location.edit.createLocationTitle',
  },
  description: {
    defaultMessage: 'Description',
    id: 'location.edit.description',
  },
  instructions: {
    defaultMessage: 'Instructions',
    id: 'location.edit.instructions',
  },
  addressLine1: {
    defaultMessage: 'Address line 1',
    id: 'location.edit.addressLine1',
  },
  addressLine2: {
    defaultMessage: 'Address line 2',
    id: 'location.edit.addressLine2',
  },
  zipCode: {
    defaultMessage: 'Zip code',
    id: 'location.edit.zipCode',
  },
  city: {
    defaultMessage: 'City',
    id: 'location.edit.city',
  },
  countryCode: {
    defaultMessage: 'Country',
    id: 'location.edit.countryCode',
  },
  chooseCountry: {
    defaultMessage: 'Choose country',
    id: 'location.edit.chooseCountry',
  },
  dragPictureHere: {
    defaultMessage: 'Drag picture here',
    id: 'location.edit.dragPictureHere',
  },
  or: {
    defaultMessage: 'or',
    id: 'location.edit.pictureUpload.or',
  },
  choosePicture: {
    defaultMessage: 'Choose picture',
    id: 'location.edit.choosePicture',
  },
  checkLocation: {
    defaultMessage: 'Check location',
    id: 'location.edit.checkLocation',
  },
  requiredField: {
    defaultMessage: 'This field is required',
    id: 'location.edit.requiredField',
  },
  validZipCodeRequired: {
    defaultMessage: 'Zip code must be a number without whitespaces!',
    id: 'location.edit.validZipCodeRequired',
  },
  checkMapLocation: {
    defaultMessage: 'Please check location!',
    id: 'location.edit.checkMapLocation',
  },
});

const validate = (values, props) => {
  const { formatMessage } = props.intl;

  const errors = {};
  if (!values.name) {
    errors.name = formatMessage(messages.requiredField);
  }

  if (!values.addressLine1) {
    errors.addressLine1 = formatMessage(messages.requiredField);
  }

  if (!values.city) {
    errors.city = formatMessage(messages.requiredField);
  }

  if (!values.zipCode) {
    errors.zipCode = formatMessage(messages.requiredField);
  } else if (!validator.isNumeric(values.zipCode)) {
    errors.zipCode = formatMessage(messages.validZipCodeRequired);
  }

  if (!values.countryCode) {
    errors.countryCode = formatMessage(messages.requiredField);
  }

  if (!values.latitude) {
    errors.latitude = formatMessage(messages.checkMapLocation);
  }

  if (!values.longitude) {
    errors.longitude = formatMessage(messages.checkMapLocation);
  }

  return errors;
};

export class CreateLocationDialog extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    setField: PropTypes.func.isRequired,
    nxLocation: PropTypes.object,
    intl: PropTypes.object.isRequired,
    countries: PropTypes.object,
    uploadLocationPicture: PropTypes.func.isRequired,
    updateLocationCoords: PropTypes.func.isRequired,
    checkLocationCoords: PropTypes.func.isRequired,
    mapZoom: PropTypes.number.isRequired,
    isMapVisible: PropTypes.bool.isRequired,
    changeMapZoom: PropTypes.func.isRequired,
    saveNxLocation: PropTypes.func.isRequired,
    hideLocationMap: PropTypes.func.isRequired,
    params: PropTypes.object,
    locations: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const { nxLocation, initialize, setField, params, locations } = this.props;

    const locationId = params ? params.locationId : null;
    let activeLocation = nxLocation;

    if (locationId) {
      activeLocation = locations.get(parseInt(locationId, 10));
    }

    setField(['editLocation'], activeLocation ? activeLocation : new NextLocation());
    initialize(activeLocation ? activeLocation.toObject() : new NextLocation().toObject());
  }

  componentWillUnmount() {
    const { hideLocationMap } = this.props;
    hideLocationMap();
  }

  renderInput(data) {
    const { input, label, type, meta: { asyncValidating, touched, error, pristine } } = data;

    return (
      <div className={`form-group ${touched && error && (!pristine || !input.value) ? 'has-error' : ''}`}>
        <label>{label}</label>

        <input
          {...input}
          readOnly={data.readOnly}
          placeholder={label} type={type}
          className="form-control"
        />

        {pristine && input.value ?
          ''
          :
          <div className="has-error">
            {touched && error && <label>{error}</label>}
          </div>
        }
      </div>
    );
  }

  renderEditor(data) {
    const { input, label, name, children, meta: { touched, error } } = data;

    return (
      <div className="col-md-6">
        <div className={`form-group ${error ? 'has-error' : ''}`}>
          <label className="control-label">{label}</label>
          <TextEditor
            {...input}
          />
          <div className="has-error">
            {error && <label>{error}</label>}
          </div>
        </div>
      </div>
    );
  }

  renderSelect(data) {
    const { input, label, children, meta: { touched, error } } = data;

    return (
      <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
        <label>{label}</label>
        <select
          {...input}
          className="form-control"
        >
        {children}
        </select>
        <div className="has-error">
          {touched && error && <label>{error}</label>}
        </div>
      </div>
    );
  }

  renderCheckLocationButton(fields) {
    return (
      <div className="form-group location-check">
        <button
          className="btn btn-primary"
          onClick={() => fields.checkLocationCoords(fields.formAddress, fields.latitude.input.onChange, fields.longitude.input.onChange)}
        >
          {fields.label}
        </button>
        <div className="has-error">
          {<label>{fields.latitude.meta.error || fields.longitude.meta.error}</label>}
        </div>
      </div>
    );
  }

  renderLocationMap(fields) {
    return (
      <div className="col-md-6">
        {fields.isMapVisible === true || (fields.latitude.input.value && fields.longitude.input.value) ?
          <div className="map" style={{ maxWidth: '550px', height: '300px' }}>
            <Map
              onClick={({ latlng }) => {fields.latitude.input.onChange(latlng.lat); fields.longitude.input.onChange(latlng.lng);}}
              center={[
                fields.latitude.input.value,
                fields.longitude.input.value
              ]}
              zoom={fields.mapZoom}
              onZoomend={(e) => fields.changeMapZoom(e.target._zoom)}
              maxHeight={300}
              maxWidth={500}
              style={{ maxWidth: '550px', height: '300px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {fields.latitude.input.value !== null && fields.longitude.input.value !== null ?
                <Marker position={[fields.latitude.input.value, fields.longitude.input.value]} />
                : ''
              }
            </Map>
          </div>
          : ''
        }
      </div>
    );
  }

  renderPictures(data) {
    const { input, label, uploadLocationPicture, children, meta: { touched, error } } = data;

    return (
      <div className="images col-md-12">
        {input.value.map((picture, index) =>
          <div
            key={picture.id}
            className="image"
            onClick={() => input.onChange(input.value.delete(index))}
          >
            <div className="picture-remove-overlay">
              <i className="fa fa-trash-o"></i>
            </div>
            <img src={picture.url} alt={picture.caption} />
          </div>
        )}

        <div className="image upload">
          <Dropzone multiple={false} accept="image/png,image/jpeg" onDrop={(files) => uploadLocationPicture(files, input.value, input.onChange)}>
            <div id="dropzone">
              {label}
            </div>
          </Dropzone>
        </div>
      </div>
    );
  }

  render() {
    const { fields, formAddress, pristine, submitting, countries, isMapVisible, mapZoom } = this.props;
    const {
      uploadLocationPicture,
      updateLocationCoords,
      changeMapZoom,
      checkLocationCoords,
      saveNxLocation,
      setField,
      handleSubmit,
    } = this.props;

    const { formatMessage } = this.props.intl;

    if (!countries || !fields.instructions.value) {
      return <div></div>;
    }

    return (
      <Modal
        show
        dialogClassName="create-location-modal"
        onHide={() => browserHistory.goBack()}
      >
        <Header closeButton>
          <Title><FormattedMessage {...messages.createLocationTitle} /></Title>
        </Header>

        <Body>
          <form className="col-md-12" onSubmit={handleSubmit((data) => saveNxLocation(data))}>
            <div className="col-md-6">
              <Field
                name="name"
                type="text"
                component={this.renderInput}
                label={`${formatMessage(messages.locationName)}*`}
              />

              <Field
                name="addressLine1"
                type="text"
                component={this.renderInput}
                label={`${formatMessage(messages.addressLine1)}*`}
              />

              <Field
                name="addressLine2"
                type="text"
                component={this.renderInput}
                label={`${formatMessage(messages.addressLine2)}`}
              />

              <Field
                name="city"
                type="text"
                component={this.renderInput}
                label={`${formatMessage(messages.city)}*`}
              />

              <Field
                name="zipCode"
                type="text"
                component={this.renderInput}
                label={`${formatMessage(messages.zipCode)}*`}
              />

              <Field
                name="countryCode"
                component={this.renderSelect}
                label={`${formatMessage(messages.countryCode)}*`}
              >
                <option readOnly>{formatMessage(messages.chooseCountry)}</option>
                {countries.entrySeq().map(entry =>
                  <option key={entry[0]} value={entry[0]}>{entry[1]}</option>
                )}
              </Field>

              <Fields
                names={['latitude', 'longitude']}
                component={this.renderCheckLocationButton}
                label={`${formatMessage(messages.checkLocation)}`}
                checkLocationCoords={checkLocationCoords}
                formAddress={formAddress}
              />
            </div>

            <Fields
              names={['latitude', 'longitude']}
              component={this.renderLocationMap}
              isMapVisible={isMapVisible}
              changeMapZoom={changeMapZoom}
              mapZoom={mapZoom}
            />

            <Field
              name="instructions"
              component={this.renderEditor}
              label={formatMessage(messages.instructions)}
            />

            <Field
              name="description"
              component={this.renderEditor}
              label={formatMessage(messages.description)}
            />

            <Field
              name="pictures"
              uploadLocationPicture={uploadLocationPicture}
              label={
                <label htmlFor="image-upload">
                  <div>{formatMessage(messages.dragPictureHere)}</div>
                  <div>{formatMessage(messages.or)}</div>
                  <span className="btn btn-primary">{formatMessage(messages.choosePicture)}</span>
                  <i className="icon icon-plus"></i>
                </label>
              }
              component={this.renderPictures}
            />

            <div className="col-md-12">
              <button type="submit" disabled={pristine || submitting} className="btn btn-success pull-right">
                <FormattedMessage {...messages.saveLocationButton} />
              </button>
            </div>
          </form>
          <div className="clearfix"></div>
        </Body>
        <Footer></Footer>
      </Modal>
    );
  }
}

CreateLocationDialog = fields(CreateLocationDialog, {
  path: 'editLocation',
  fields: [
    'id',
    'name',
    'description',
    'instructions',
    'userUid',
    'pictures',
    'latitude',
    'longitude',
    'addressLine1',
    'addressLine2',
    'city',
    'zipCode',
    'countryCode',
  ],
});

CreateLocationDialog = reduxForm({
  form: 'editLocation',
  validate,
})(CreateLocationDialog);

CreateLocationDialog = injectIntl(CreateLocationDialog);
const selector = formValueSelector('editLocation');

export default connect((state) => ({
  locale: state.intl.currentLocale,
  countries: state.nxLocations.countries,
  mapZoom: state.nxLocations.mapZoom,
  isMapVisible: state.nxLocations.isMapVisible,
  locations: state.nxLocations.locations,
  formAddress: selector(state, 'addressLine1', 'addressLine2', 'city', 'zipCode', 'countryCode', 'latitude', 'longitude'),
  initialValues: state.fields.get('editLocation') ? state.fields.get('editLocation').toObject() : state.fields.get('editLocation'),
}), {...fieldActions, ...pictureActions, ...locationsActions})(CreateLocationDialog);
