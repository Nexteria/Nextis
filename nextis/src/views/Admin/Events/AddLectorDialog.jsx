import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'common/store';

import Close from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from 'components/CustomButtons/IconButton';
import ItemGrid from 'components/Grid/ItemGrid';
import Button from 'components/CustomButtons/Button';

import eventDetailsStyle from 'assets/jss/material-dashboard-pro-react/views/eventDetailsStyle';
import Autocomplete from '../../../components/Autocomplete/Autocomplete';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export class AddLectorDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lectorId: '',
    };

    this.handleAddLector = this.handleAddLector.bind(this);
  }

  handleAddLector() {
    const { lectorId } = this.state;
    const {
      event,
      attachLector,
      actions,
      onClose
    } = this.props;

    if (lectorId && event) {
      attachLector({
        variables: {
          lectorId,
          eventId: event.id,
        }
      }).then(async () => {
        actions.setNotification({
          id: 'attachLector',
          place: 'tr',
          color: 'success',
          message: 'Lector bol pridaný'
        });
        onClose();
      }).catch(() => {
        actions.setNotification({
          id: 'attachLector',
          place: 'tr',
          color: 'danger',
          message: 'Pri pridávaní lektora došlo k chybe!'
        });
        onClose();
      });
    }
  }


  render() {
    const { data, onClose, classes } = this.props;

    if (data.loading) {
      return null;
    }

    const { users } = data;
    const { lectorId } = this.state;

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
            onClick={onClose}
          >
            <Close className={classes.modalClose} />
          </IconButton>

          <h2 className={classes.modalTitle}>
            {'Pridať lektora'}
          </h2>
        </DialogTitle>
        <DialogContent>
          <ItemGrid xs={12}>
            <Autocomplete
              label="Lektor"
              onChange={item => this.setState({ lectorId: item.value })}
              value={lectorId}
              suggestions={users.map(lector => ({
                value: lector.id,
                label: `${lector.firstName} ${lector.lastName} (${lector.email})`
              }))}
            />
          </ItemGrid>
          <ItemGrid xs={12} style={{ textAlign: 'center' }}>
            <Button
              color="success"
              size="sm"
              customClass={classes.marginRight}
              onClick={this.handleAddLector}
              disabled={!lectorId}
            >
              Pridať
            </Button>
          </ItemGrid>
        </DialogContent>
      </Dialog>
    );
  }
}

const lectorsQueries = gql`
  query FetchLectors {
    users (roles: ["LECTOR"]) {
      id
      firstName
      lastName
      email
    }
  }
`;

const attachLectorMutation = gql`
  mutation AttachLector (
    $lectorId: Int!
    $eventId: Int!
  ) {
    AttachLector (
      lectorId: $lectorId
      eventId: $eventId
    ) {
      id
      lectors {
        id
        firstName
        lastName
        email
        profilePicture {
          id
          filePath
        }
      }
    }
  }
`;

export default compose(
  connect(state => ({ user: state.user })),
  withStyles(eventDetailsStyle),
  graphql(lectorsQueries),
  graphql(attachLectorMutation, { name: 'attachLector' }),
  withRouter,
)(AddLectorDialog);
