import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { Map, TileLayer, Marker } from 'react-leaflet';


import * as eventActions from '../../../common/events/actions';
import './LocationDetailsDialog.scss';

const messages = defineMessages({
  closeButton: {
    defaultMessage: 'Close',
    id: 'event.users.locationDetails.closeButton',
  },
  pictures: {
    defaultMessage: 'Pictures',
    id: 'event.users.locationDetails.pictures',
  },
  address: {
    defaultMessage: 'Address',
    id: 'event.users.locationDetails.address',
  },
  description: {
    defaultMessage: 'Description',
    id: 'event.users.locationDetails.description',
  },
  instructions: {
    defaultMessage: 'Instructions',
    id: 'event.users.locationDetails.instructions',
  },
});

export class LocationDetailsDialog extends Component {

  static propTypes = {
    nxLocation: PropTypes.object.isRequired,
    closeLocationDetailsDialog: PropTypes.func.isRequired,
  }

  render() {
    const { nxLocation } = this.props;
    const {
      closeLocationDetailsDialog,
    } = this.props;

    return (
      <Modal
        show
        bsSize="large"
        dialogClassName="locations-details-dialog"
        onHide={closeLocationDetailsDialog}
      >
        <Header closeButton>
          <Title>{nxLocation.name}</Title>
        </Header>

        <Body>
          <div className="col-md-4">
            <label><FormattedMessage {...messages.address} /></label>
            <div>{nxLocation.addressLine1}, {nxLocation.addressLine2}</div>
            <div>{nxLocation.city}, {nxLocation.zipCode}</div>
            <div>{nxLocation.countryCode}</div>
          </div>

          <div className="col-md-8">
            <div className="map" style={{ maxWidth: '550px', height: '300px' }}>
              <Map
                center={[
                  nxLocation.latitude,
                  nxLocation.longitude,
                ]}
                zoom={14}
                maxHeight={300}
                maxWidth={500}
                style={{ maxWidth: '550px', height: '300px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[nxLocation.latitude, nxLocation.longitude]} />
              </Map>
            </div>
          </div>

          <div className="form-group col-md-12">
            <label><FormattedMessage {...messages.description} /></label>
            <div
              dangerouslySetInnerHTML={{ __html: nxLocation.description.toString('html') }}
            >
            </div>
          </div>

          <div className="form-group  col-md-12">
            <label><FormattedMessage {...messages.instructions} /></label>
            <div
              dangerouslySetInnerHTML={{ __html: nxLocation.instructions.toString('html') }}
            >
            </div>
          </div>

          <div className="col-md-12">
            <div><label><FormattedMessage {...messages.pictures} /></label></div>
            <div className="images col-md-12">
              {nxLocation.pictures.map(picture =>
                <div
                  key={picture.id}
                  className="image col-md-3"
                >
                  <img src={picture.url} alt={picture.caption} />
                </div>
              )}
            </div>
          </div>
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-primary"
              onClick={closeLocationDetailsDialog}
            >
              <FormattedMessage {...messages.closeButton} />
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

export default connect(null, eventActions)(LocationDetailsDialog);
