import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'material-ui/styles/withStyles';
import { connect } from 'common/store';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';

import Slide from 'material-ui/transitions/Slide';
import Checkbox from 'material-ui/Checkbox';

import Dialog from 'material-ui/Dialog';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import IconButton from 'components/CustomButtons/IconButton';
import ItemGrid from 'components/Grid/ItemGrid';
import Button from 'components/CustomButtons/Button';
import RegularCard from 'components/Cards/RegularCard';

import eventDetailsStyle from 'assets/jss/material-dashboard-pro-react/views/eventDetailsStyle';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export class LocationEditDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locationId: null,
      locationName: '',
    };

    this.handleOnClose = this.handleOnClose.bind(this);
  }

  handleOnClose() {
    const { history } = this.props;

    if (document.referrer.indexOf(process.env.REACT_APP_WEB_URL) >= 0) {
      history.goBack();
    } else {
      history.push('/admin/locations');
    }
  }

  render() {
    const { data, classes } = this.props;

    if (data.loading) {
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
        onClose={this.handleOnClose}
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
            <ItemGrid xs={12} sm={12} md={5}>
              <CustomInput
                labelText="Názov miesta*"
                id="name"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: true
                }}
              />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={3}>
              <CustomInput
                labelText="Adresa*"
                id="addressLine1"
                formControlProps={{
                  fullWidth: true
                }}
              />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={4}>
              <CustomInput
                labelText="Adresa"
                id="addressLine2"
                formControlProps={{
                  fullWidth: true
                }}
              />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={4}>
              <CustomInput
                labelText="Mesto*"
                id="city"
                formControlProps={{
                  fullWidth: true
                }}
              />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={4}>
              <CustomInput
                labelText="PSČ*"
                id="zipCode"
                formControlProps={{
                  fullWidth: true
                }}
              />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={4}>
              <CustomInput
                labelText="Krajina*"
                id="countryCode"
                formControlProps={{
                  fullWidth: true
                }}
              />
            </ItemGrid>
            <ItemGrid xs={12} sm={12} md={4}>
              <CustomEditor
                className={classes.textEditor}
                toolbarClassName={classes.textEditorToolbar}
              />
            </ItemGrid>
          </GridContainer>
        </DialogContent>
      </Dialog>
    );
  }
}

const eventQuery = gql`
query FetchEvent ($id: Int, $userId: Int){
  event (id: $id){
    id
    name
    parentEvent {
      id
      name
    }
    groupedEvents {
      id
    }
    terms {
      id
      eventStartDateTime
      parentTermId
      location {
        id
        latitude
        longitude
        name
      }
    }
    form {
      id
      answeredByUser (userId: $userId)
    }
  }
}
`;

export default compose(
  connect(state => ({ user: state.user })),
  withStyles(eventDetailsStyle),
  withRouter,
)(LocationEditDialog);
