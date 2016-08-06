import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';


import { fields } from '../../common/lib/redux-fields/index';
import NextLocation from '../../common/nxLocations/models/Location';
import * as fieldActions from '../../common/lib/redux-fields/actions';
import TextEditor from '../components/TextEditor';


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
});

export class CreateLocationDialog extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    setField: PropTypes.func.isRequired,
    nxLocation: PropTypes.object,
    intl: PropTypes.object.isRequired,
    countries: PropTypes.object,
  }

  componentWillMount() {
    const { nxLocation, setField } = this.props;
    setField(['editLocation'], nxLocation ? nxLocation : new NextLocation());
  }

  render() {
    const { fields, countries } = this.props;
    const { formatMessage } = this.props.intl;

    if (!countries) {
      return <div></div>;
    }

    return (
      <Modal
        show
        dialogClassName="create-attendee-group-modal"
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
                {...fields.city}
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
          </div>

          <div className="col-md-6">
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
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-success"
              onClick={() => console.log('Save')}
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
    'uid',
    'name',
    'description',
    'instructions',
    'userUid',
    'photo',
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
}), fieldActions)(CreateLocationDialog);
