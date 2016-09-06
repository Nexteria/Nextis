import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';
import Dropzone from 'react-dropzone';
import { Map, TileLayer, Marker } from 'react-leaflet';


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
  }
});

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
    const { nxLocation, setField, params, locations } = this.props;

    const locationId = params ? params.locationId : null;
    let activeLocation = nxLocation;

    if (locationId) {
      activeLocation = locations.get(parseInt(locationId, 10));
    }

    setField(['editLocation'], activeLocation ? activeLocation : new NextLocation());
  }

  componentWillUnmount() {
    const { hideLocationMap } = this.props;
    hideLocationMap();
  }

  render() {
    const { fields, countries, isMapVisible, mapZoom } = this.props;
    const {
      uploadLocationPicture,
      updateLocationCoords,
      changeMapZoom,
      checkLocationCoords,
      saveNxLocation,
      setField,
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
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="locationName">
                <FormattedMessage {...messages.locationName} />
              </label>

              <input
                id="locationName"
                name="locationName"
                className="form-control"
                {...fields.name}
              />
            </div>

            <div className="form-group">
              <label htmlFor="addressLine1">
                <FormattedMessage {...messages.addressLine1} />
              </label>

              <input
                id="addressLine1"
                name="addressLine1"
                className="form-control"
                {...fields.addressLine1}
              />
            </div>

            <div className="form-group">
              <label htmlFor="addressLine2">
                <FormattedMessage {...messages.addressLine2} />
              </label>

              <input
                id="addressLine2"
                name="addressLine2"
                className="form-control"
                {...fields.addressLine2}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">
                <FormattedMessage {...messages.city} />
              </label>

              <input
                id="city"
                name="city"
                className="form-control"
                {...fields.city}
              />
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">
                <FormattedMessage {...messages.zipCode} />
              </label>

              <input
                id="zipCode"
                name="zipCode"
                className="form-control"
                {...fields.zipCode}
              />
            </div>

            <div className="form-group">
              <label htmlFor="countryCode">
                <FormattedMessage {...messages.countryCode} />
              </label>

              <select
                className="form-control"
                {...fields.countryCode}
                id="countryCode"
              >
                <option readOnly>{formatMessage(messages.chooseCountry)}</option>
                {countries.entrySeq().map(entry =>
                  <option key={entry[0]} value={entry[0]}>{entry[1]}</option>
                )}
              </select>
            </div>
            <div className="form-group location-check">
              <button className="btn btn-primary" onClick={() => checkLocationCoords(fields)}><FormattedMessage {...messages.checkLocation} /></button>
            </div>
          </div>

          <div className="col-md-6">
            {isMapVisible === true || (fields.latitude.value !== null && fields.longitude.value !== null) ?
              <div className="map" style={{ maxWidth: '550px', height: '300px' }}>
                <Map
                  onClick={({ latlng }) => updateLocationCoords(latlng.lat, latlng.lng)}
                  center={[
                    fields.latitude.value,
                    fields.longitude.value
                  ]}
                  zoom={mapZoom}
                  onZoomend={(e) => changeMapZoom(e.target._zoom)}
                  maxHeight={300}
                  maxWidth={500}
                  style={{ maxWidth: '550px', height: '300px' }}
                >
                  <TileLayer
                    url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {fields.latitude.value !== null && fields.longitude.value !== null ?
                    <Marker position={[fields.latitude.value, fields.longitude.value]} />
                    : ''
                  }
                </Map>
              </div>
              : ''
            }
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="instructions" className="control-label">
                <FormattedMessage {...messages.instructions} />
              </label>

              <TextEditor
                value={fields.instructions.value}
                onChange={(value) =>
                  fields.instructions.onChange({ target: { value } })
                }
                id="instructions"
                placeholder="Instructions ..."
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="description" className="control-label">
                <FormattedMessage {...messages.description} />
              </label>

              <TextEditor
                value={fields.description.value}
                onChange={(value) =>
                  fields.description.onChange({ target: { value } })
                }
                id="description"
                placeholder="Description ..."
              />
            </div>
          </div>

          <div className="images col-md-12">
            {fields.pictures.value.map((picture, index) =>
              <div
                key={picture.id}
                className="image"
                onClick={() => setField(['editLocation', 'pictures'], fields.pictures.value.delete(index))}
              >
                <div className="picture-remove-overlay">
                  <i className="fa fa-trash-o"></i>
                </div>
                <img src={picture.url} alt={picture.caption} />
              </div>
            )}

            <div className="image upload">
              <Dropzone multiple={false} accept="image/png,image/jpeg" onDrop={(files) => uploadLocationPicture(files, fields.pictures.value)}>
                <div id="dropzone">
                  <label htmlFor="image-upload">
                    <div>{formatMessage(messages.dragPictureHere)}</div>
                    <div>{formatMessage(messages.or)}</div>
                    <span className="btn btn-primary">{formatMessage(messages.choosePicture)}</span>
                    <i className="icon icon-plus"></i>
                  </label>
                </div>
              </Dropzone>
            </div>
          </div>
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-success"
              onClick={() => saveNxLocation(fields)}
            >
              <FormattedMessage {...messages.saveLocationButton} />
            </button>
          </div>
        </Footer>
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

CreateLocationDialog = injectIntl(CreateLocationDialog);

export default connect((state) => ({
  locale: state.intl.currentLocale,
  countries: state.nxLocations.countries,
  mapZoom: state.nxLocations.mapZoom,
  isMapVisible: state.nxLocations.isMapVisible,
  locations: state.nxLocations.locations,
}), {...fieldActions, ...pictureActions, ...locationsActions})(CreateLocationDialog);
