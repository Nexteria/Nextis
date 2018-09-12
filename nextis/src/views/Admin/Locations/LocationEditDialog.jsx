import React from 'react';
import { withRouter } from 'react-router-dom';
import { branch, compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'material-ui/styles/withStyles';
import { connect } from 'common/store';
import request from "common/fetch";
import Spinner from 'react-spinkit';

import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';

import Slide from 'material-ui/transitions/Slide';
import { Map, TileLayer, Marker } from 'react-leaflet';

import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
import Dialog from 'material-ui/Dialog';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import IconButton from 'components/CustomButtons/IconButton';
import ItemGrid from 'components/Grid/ItemGrid';
import GridContainer from 'components/Grid/GridContainer';
import FormLabel from 'material-ui/Form/FormLabel';
import CustomInput from 'components/CustomInput/CustomInput';

import CustomEditor, { stateFromHTML } from 'components/CustomEditor/CustomEditor';
import Button from 'components/CustomButtons/Button';
import { countries } from 'common/utils';

import locationsEditStyles from 'assets/jss/material-dashboard-pro-react/views/locationsEditStyles';
import { locationsQuery } from 'views/Admin/Locations/Queries';


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export class LocationEditDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      zoom: 14,
      latitude: null,
      longitude: null,
      locationId: null,
      locationName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      zipCode: '',
      countryCode: 'SK',
      instructions: stateFromHTML(''),
      description: stateFromHTML(''),
      error: '',
      updating: false,
    };

    this.handleOnClose = this.handleOnClose.bind(this);
    this.checkLocationCoords = this.checkLocationCoords.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { data, match } = newProps;

    if (data && !data.loading && match.params && match.params.locationId && !this.state.locationId) {
      const location = data.locations[0];

      this.setState({
        locationId: location.id,
        latitude: location.latitude,
        longitude: location.longitude,
        locationName: location.name,
        addressLine1: location.addressLine1,
        addressLine2: location.addressLine2,
        city: location.city,
        zipCode: location.zipCode,
        countryCode: location.countryCode,
        instructions: stateFromHTML(location.instructions),
        description: stateFromHTML(location.description),
      })
    }
  }

  handleOnClose() {
    const { history } = this.props;

    if (document.referrer.indexOf(process.env.REACT_APP_WEB_URL) >= 0) {
      history.goBack();
    } else {
      history.push('/admin/locations');
    }
  }

  handleSubmit() {
    const {
      longitude,
      latitude,
      locationName,
      addressLine1,
      city,
      zipCode,
      countryCode,
    } = this.state;

    const { actions, updateLocation } = this.props;

    if (!latitude || !longitude) {
      this.setState({ error: 'Prosím najskôr skontroluj a zaznač adresu na mape'});
      return
    }

    if (
      !locationName.trim() ||
      !addressLine1.trim() ||
      !city.trim() ||
      !zipCode.trim() ||
      !countryCode.trim()
    ) {
      this.setState({ error: 'Prosím vyplň všetky povinné políčka'});
      return
    }

    updateLocation({ variables: {
      latitude,
      longitude,
      id: this.state.locationId ? this.state.locationId : null,
      name: locationName.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: this.state.addressLine2.trim(),
      city: city.trim(),
      zipCode: zipCode.trim(),
      countryCode: countryCode.trim(),
      instructions: this.state.instructions.toString('html'),
      description: this.state.description.toString('html'),
    } }).then(async () => {
      this.handleOnClose();
      actions.setNotification({
        id: 'updateLocation',
        place: 'tr',
        color: 'success',
        message: 'Miesto bolo aktualizované'
      });

      this.setState({ updating: false });
    }).catch((errorData) => {
      const error = errorData.graphQLErrors[0];

      if (error.message !== 'validation') {
        actions.setNotification({
          id: 'updateLocation',
          place: 'tr',
          color: 'danger',
          message: 'Pri aktualizovaní došlo k chybe. Skúste znova prosím!'
        });
      } else {
        actions.setNotification({
          id: 'updateLocation',
          place: 'tr',
          color: 'danger',
          message:
            'Zadané údaje neboli platné. Skontrolujte formulár prosím!'
        });
      }
    })
  }

  checkLocationCoords() {
    let query = `address=${this.state.addressLine1}`;
    query = `${query}${this.state.addressLine2 ? `, ${this.state.addressLine2}` : ''}`;
    query = `${query}, ${this.state.city}`;
    query = `${query}, ${this.state.zipCode}`;
    query = `${query}, ${this.state.countryCode}`;

    request(`https://maps.googleapis.com/maps/api/geocode/json?${query}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`, {
      headers: {},
      disableCredentials: true,
    }).then(response => response.json())
      .then(response => {
        if (response.status === 'ZERO_RESULTS') {
          this.setState({
            latitude: 48.1512152,
            longitude: 17.1039008,
          })
        } else {
          this.setState({
            latitude: response.results[0].geometry.location.lat,
            longitude: response.results[0].geometry.location.lng,
          })
        }
      })
  }

  render() {
    const { data, classes } = this.props;

    if (data && data.loading) {
      return null;
    }

    const {
        locationName,
    } = this.state;


    return (
      <Dialog
        open
        transition={Transition}
        fullWidth
        onClose={null}
      >
        <DialogTitle
          disableTypography
          className={classes.modalHeader}
        >
          <IconButton
            customClass={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            onClick={this.handleOnClose}
          >
            <Close className={classes.modalClose} />
          </IconButton>

          <h2 className={classes.modalTitle}>
            {locationName}
          </h2>
        </DialogTitle>
        <DialogContent>
          <GridContainer>
            <ItemGrid xs={12}>
              <CustomInput
                labelText="Názov miesta*"
                id="name"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state['locationName'],
                  type: 'text',
                  onChange: (e) => this.setState({ locationName: e.target.value })
                }}
              />
            </ItemGrid>
            <ItemGrid xs={12}>
              <CustomInput
                labelText="Adresa*"
                id="addressLine1"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state['addressLine1'],
                  type: 'text',
                  onChange: (e) => this.setState({ addressLine1: e.target.value })
                }}
              />
            </ItemGrid>
            <ItemGrid xs={12}>
              <CustomInput
                labelText="Adresa"
                id="addressLine2"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state['addressLine2'],
                  type: 'text',
                  onChange: (e) => this.setState({ addressLine2: e.target.value })
                }}
              />
            </ItemGrid>
            <ItemGrid xs={12}>
              <CustomInput
                labelText="Mesto*"
                id="city"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state['city'],
                  type: 'text',
                  onChange: (e) => this.setState({ city: e.target.value })
                }}
              />
            </ItemGrid>
            <ItemGrid xs={12}>
              <CustomInput
                labelText="PSČ*"
                id="zipCode"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  value: this.state['zipCode'],
                  type: 'text',
                  onChange: (e) => this.setState({ zipCode: e.target.value })
                }}
              />
            </ItemGrid>

            <ItemGrid xs={12} className={classes.labelHorizontal}>
              <FormLabel>
              <span>Krajina</span>
              </FormLabel>
            </ItemGrid>

            <ItemGrid xs={12}>
              <Select
                MenuProps={{
                  className: classes.selectMenu
                }}
                classes={{
                  select: classes.select
                }}
                value={this.state.countryCode}
                fullWidth
                onChange={event => this.setState({ countryCode: event.target.value })}
                inputProps={{
                  name: 'countryCode',
                  id: 'countryCode',
                }}
              >
                <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem
                  }}
                >
                  {'Vyber hodnotu'}
                </MenuItem>
                {[...countries].sort((a, b) => a[1].localeCompare(b[1])).map(country => (
                  <MenuItem
                    key={country[0]}
                    classes={{
                      root: classes.selectMenuItem
                    }}
                    value={country[0]}
                  >
                    {country[1]}
                  </MenuItem>
                ))}
              </Select>
            </ItemGrid>
            <ItemGrid xs={12} className={classes.labelHorizontal}>
              <FormLabel>
              <span>Inštrukcie</span>
              </FormLabel>
            </ItemGrid>
            <ItemGrid xs={12}>
              <CustomEditor
                className={classes.textEditor}
                toolbarClassName={classes.textEditorToolbar}
                editorState={this.state['instructions']}
                onChange={state => this.setState({ instructions: state })}
              />
            </ItemGrid>

            <ItemGrid xs={12} className={classes.labelHorizontal}>
              <FormLabel>
                <span>Popis</span>
              </FormLabel>
            </ItemGrid>
            <ItemGrid xs={12}>
              <CustomEditor
                className={classes.textEditor}
                toolbarClassName={classes.textEditorToolbar}
                editorState={this.state['description']}
                onChange={state => this.setState({ description: state })}
              />
            </ItemGrid>

            <ItemGrid xs={12} style={{ textAlign: 'center', marginTop: '1em' }}>
              <Button color="nexteriaOrange" onClick={this.checkLocationCoords} size="xs">
                Skontrolovať adresu
              </Button>
            </ItemGrid>

            <ItemGrid xs={12}>
              <div className="map" style={{ maxWidth: '550px', height: '300px', marginTop: '1em' }}>
                <Map
                  onClick={({ latlng }) => this.setState({latitude: latlng.lat, longitude: latlng.lng })}
                  center={[
                    this.state.latitude || 48.1423257,
                    this.state.longitude || 17.1010063
                  ]}
                  zoom={this.state.zoom}
                  onZoomend={(e) => this.setState({ zoom: e.target._zoom})}
                  maxHeight={300}
                  maxWidth={500}
                  style={{ maxWidth: '550px', height: '300px' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {this.state.latitude !== null && this.state.longitude !== null ?
                    <Marker position={[this.state.latitude, this.state.longitude]} />
                    : ''
                  }
                </Map>
              </div>
            </ItemGrid>
          </GridContainer>
        </DialogContent>
        <DialogActions>
          {this.state.error ?
            <div style={{ padding: '1em', color: 'red' }}>{this.state.error}</div>
            : null
          }
          <Button onClick={this.handleOnClose} color="danger">
            Zrušiť
          </Button>
          <Button onClick={this.handleSubmit} color="success" disabled={this.state.updating}>
            {this.state.updating === true ? (
              <Spinner
                name="line-scale-pulse-out"
                fadeIn="none"
                className={classes.buttonSpinner}
                color="#fff"
              />
              ) : null
            }
            {this.state.locationId ? 'Uložiť' : 'Vytvoriť'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const locationQuery = gql`
query FetchLocations ($id: Int!){
  locations (id: $id){
    id
    latitude
    longitude
    name
    addressLine1
    addressLine2
    city
    zipCode
    countryCode
    instructions
    description
  }
}
`;

const locationMutation = gql`
  mutation UpdateLocation (
    $latitude: Float!
    $longitude: Float!
    $id: Int
    $name: String!
    $addressLine1: String!
    $addressLine2: String!
    $city: String!
    $zipCode: String!
    $countryCode: String!
    $instructions: String!
    $description: String!
  ) {
    UpdateLocation(
      latitude: $latitude
      longitude: $longitude
      id: $id
      name: $name
      addressLine1: $addressLine1
      addressLine2: $addressLine2
      city: $city
      zipCode: $zipCode
      countryCode: $countryCode
      instructions: $instructions
      description: $description
    ) {
      id
      latitude
      longitude
      name
      addressLine1
      addressLine2
      city
      zipCode
      countryCode
      instructions
      description
    }
  }
`;

export default compose(
  withRouter,
  connect(state => ({ user: state.user })),
  graphql(locationMutation, { name: 'updateLocation' }),
  branch(
    props => props.match.params.locationId,
    graphql(locationQuery, {
      options: (props) => {
        const { match } = props;
  
        return {
          notifyOnNetworkStatusChange: true,
          variables: {
            id: match.params.locationId,
          },
          refetchQueries: [
            { query: locationsQuery }
          ]
        };
      }
    })
  ),
  withStyles(locationsEditStyles),
)(LocationEditDialog);
