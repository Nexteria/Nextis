import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

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
    hasPermission: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  editLocation(locationId) {
    browserHistory.push(`/admin/nxLocations/${locationId}`);
  }

  getLocationActions(location) {
    const { removeLocation } = this.props;

    return (
      <span className="action-buttons">
        <i
          className="fa fa-trash-o trash-group"
          onClick={() => removeLocation(location.id)}
        ></i>
        <i
          className="fa fa-pencil"
          onClick={() => this.editLocation(location.id)}
        ></i>
      </span>
    );
  }

  render() {
    const { locations, fields } = this.props;
    const { hasPermission } = this.props;
    const { formatMessage } = this.props.intl;

    if (!locations) {
      return <div></div>;
    }

    let filteredLocations = locations.valueSeq().map(location => location);
    if (fields.filter.value) {
      filteredLocations = locations.valueSeq().filter(locations =>
        diacritics.remove(`${locations.name}`).toLowerCase()
          .indexOf(diacritics.remove(fields.filter.value.toLowerCase())) !== -1
      );
    }

    const locationsData = filteredLocations.map(location => ({
      id: location.id,
      locationName: location.name,
      address: `${location.addressLine1}${location.addressLine2 ? `, ${location.addressLine2}` : ''}
               , ${location.city}, ${location.zipCode}, ${location.countryCode}`,
      actions: this.getLocationActions(location),
    })).toArray();

    return (
      <div className="locations-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
            {hasPermission('create_roles') ?
              <i
                className="fa fa-plus text-green"
                style={{ cursor: 'pointer', marginLeft: '2em' }}
                onClick={() => browserHistory.push('/admin/nxLocations/create')}
              ></i>
             : ''
            }
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
                  <BootstrapTable
                    data={locationsData}
                    striped
                    hover
                    height="300px"
                    containerStyle={{ height: '320px' }}
                  >
                    <TableHeaderColumn isKey hidden dataField="id" />

                    <TableHeaderColumn dataField="locationName" dataSort>
                      {formatMessage(messages.locationName)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="address" dataSort dataFormat={x => x}>
                      {formatMessage(messages.address)}
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="actions" dataFormat={x => x}>
                      {formatMessage(messages.actions)}
                    </TableHeaderColumn>
                  </BootstrapTable>
                  <div className="clearfix"></div>
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

LocationsPage = injectIntl(LocationsPage);

export default connect(state => ({
  locations: state.nxLocations.locations,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(LocationsPage);
