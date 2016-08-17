import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { fields } from '../../common/lib/redux-fields/index';
import * as actions from '../../common/nxLocations/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Locations',
    id: 'locations.manage.title'
  },
  tableTitle: {
    defaultMessage: 'Locations - managment',
    id: 'locations.manage.table.title'
  },
  noLocations: {
    defaultMessage: 'No locations here',
    id: 'locations.manage.noLocations'
  },
  locationName: {
    defaultMessage: 'Location name',
    id: 'locations.manage.locationName'
  },
  actions: {
    defaultMessage: 'Actions',
    id: 'locations.manage.actions'
  },
  address: {
    defaultMessage: 'Address',
    id: 'locations.manage.address'
  },
});

class LocationsPage extends Component {

  static propTypes = {
    locations: PropTypes.object,
    fields: PropTypes.object.isRequired,
    removeLocation: PropTypes.func.isRequired,
  };

  editLocation(locationId) {
    browserHistory.push(`/admin/nxLocations/${locationId}`);
  }

  render() {
    const { locations, fields } = this.props;
    const { removeLocation } = this.props;

    if (!locations) {
      return <div></div>;
    }

    let filteredLocations = locations.valueSeq().map(location => location);
    if (fields.filter.value) {
      filteredLocations = locations.valueSeq().filter(locations =>
        `${locations.name}`.toLowerCase()
          .indexOf(fields.filter.value.toLowerCase()) !== -1
      );
    }

    return (
      <div className="locations-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <div className="box-header">
                  <h3 className="box-title"><FormattedMessage {...messages.tableTitle} /></h3>
                  <div className="box-tools">
                    <div className="input-group input-group-sm" style={{ width: '150px' }}>
                      <input
                        type="text"
                        name="table_search"
                        className="form-control pull-right"
                        placeholder="Search"
                        {...fields.filter}
                      />

                      <div className="input-group-btn">
                        <button type="submit" className="btn btn-default">
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-body table-responsive no-padding">
                  <table className="table table-hover">
                    <tbody>
                      <tr>
                        <th><FormattedMessage {...messages.locationName} /></th>
                        <th><FormattedMessage {...messages.address} /></th>
                        <th><FormattedMessage {...messages.actions} /></th>
                      </tr>
                      {filteredLocations ?
                        filteredLocations.map(location =>
                          <tr key={location.id}>
                            <td>{`${location.name}`}</td>
                            <td>
                              {`${location.addressLine1}`}
                              {`${location.addressLine2 ? `, ${location.addressLine2}` : ''}`}
                              {`, ${location.city}, ${location.zipCode}, ${location.countryCode}`}
                            </td>
                            <td className="action-buttons">
                              <i
                                className="fa fa-trash-o trash-group"
                                onClick={() => removeLocation(location.id)}
                              ></i>
                              <i
                                className="fa fa-pencil"
                                onClick={() => this.editLocation(location.id)}
                              ></i>
                            </td>
                          </tr>
                        )
                        :
                        <tr>
                          <td colSpan="2" style={{ textAlign: 'center' }}>
                            <FormattedMessage {...messages.noLocations} />
                          </td>
                        </tr>
                      }
                      <tr
                        style={{ cursor: 'pointer' }}
                        onClick={() => browserHistory.push('/admin/nxLocations/create')}
                      >
                        <td colSpan="3" style={{ textAlign: 'center', fontSize: '1.5em' }}>
                          <i className="fa fa-plus text-green"></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

LocationsPage = fields(LocationsPage, {
  path: 'locations',
  fields: [
    'filter',
  ],
});

export default connect(state => ({
  locations: state.nxLocations.locations
}), actions)(LocationsPage);
