import React from "react";

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// @material-ui/icons
import Close from "@material-ui/icons/Close";

// core components
import Button from "components/CustomButtons/Button.jsx";

import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class InfoDialog extends React.Component {
  render() {
    const { classes, title, content, onClose, headerCloseOn } = this.props;

    return (
      <Dialog
        classes={{
          root: classes.center,
          paper: classes.modal
        }}
        open={true}
        transition={Transition}
        keepMounted
        onClose={onClose}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
      >
        <DialogTitle
          id="classic-modal-slide-title"
          disableTypography
          className={classes.modalHeader}
        >
          {headerCloseOn ?
            <IconButton
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={onClose}
            >
              <Close className={classes.modalClose} />
            </IconButton>
            : null
          }
          {title}
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
        >
          {content}
        </DialogContent>
        <DialogActions className={classes.modalFooter}>
          <Button
            onClick={onClose}
            color="dangerNoBackground"
          >
            Zavrieť
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(notificationsStyle)(InfoDialog);
