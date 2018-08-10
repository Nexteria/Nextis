import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from "material-ui/styles/withStyles";

import Close from "@material-ui/icons/Close";
import CallSplit from '@material-ui/icons/CallSplit';

import Slide from "material-ui/transitions/Slide";

import Dialog from "material-ui/Dialog";
import DialogContent from "material-ui/Dialog/DialogContent";
import DialogTitle from "material-ui/Dialog/DialogTitle";
import EventDetails from "views/Events/EventDetails.jsx";
import IconButton from "components/CustomButtons/IconButton.jsx";

import eventDetailsStyle from "assets/jss/material-dashboard-pro-react/views/eventDetailsStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export class EventDetailsDialog extends React.Component {
  onClose(history) {
    if (document.referrer.indexOf(process.env.REACT_APP_WEB_URL) >= 0) {
      history.goBack();
    } else {
      history.push('/events');
    }
  }

  render() {

    if (this.props.data.loading) {
      return null;
    }

    const { eventId } = this.props.match.params;
    const classes = this.props.classes;
    const event = this.props.data.event;

    const hasEventChoices = event.groupedEvents.length || (event.parentEvent && event.parentEvent.id);

    return (
      <Dialog
        open
        transition={Transition}
        fullWidth
        onClose={() => this.onClose(this.props.history) }
      >
        <DialogTitle
          disableTypography
          className={classes.modalHeader}
        >
          <IconButton
            customClass={classes.modalCloseButton}
            key="close"
            aria-label="Close"
            onClick={() => this.onClose(this.props.history) }
          >
            <Close className={classes.modalClose} />
          </IconButton>

          <h2 className={classes.modalTitle}>{this.props.data.event.name}</h2>

          <div className={classes.eventName}>
            {hasEventChoices && event.parentEvent ?
              <label><CallSplit /> Tento event je súčasťou eventu: {event.parentEvent.name}</label>
              : null
            }
          </div>
        </DialogTitle>
        <DialogContent
          id="event-details-dialog"
        >
          <EventDetails eventId={eventId} />
        </DialogContent>
      </Dialog>
    );
  }
}

const eventQuery = gql`
query FetchEvent ($id: Int){
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
  }
}
`;

export default compose(
  withStyles(eventDetailsStyle),
  graphql(eventQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.match.params.eventId,
      },
    })
  }),
  withRouter,
)(EventDetailsDialog);
