import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from 'recompose';

import Slide from "material-ui/transitions/Slide";

import Dialog from "material-ui/Dialog";
import DialogContent from "material-ui/Dialog/DialogContent";
import EventDetails from "views/Events/EventDetails.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export class EventDetailsDialog extends React.Component {
  render() {

    const { eventId } = this.props.match.params;

    return (
      <Dialog
        open
        transition={Transition}
        fullWidth
        onClose={() => this.props.history.push('/events') }
      >
        <DialogContent
          id="event-details-dialog"
        >
          <EventDetails eventId={eventId} />
        </DialogContent>
      </Dialog>
    );
  }
}

export default compose(
  withRouter,
)(EventDetailsDialog);
