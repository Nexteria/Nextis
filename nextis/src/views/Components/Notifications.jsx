import React from "react";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Slide from "material-ui/transitions/Slide";
import IconButton from "material-ui/IconButton";
import Dialog from "material-ui/Dialog";
import DialogTitle from "material-ui/Dialog/DialogTitle";
import DialogContent from "material-ui/Dialog/DialogContent";
import DialogActions from "material-ui/Dialog/DialogActions";

// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
import Close from "@material-ui/icons/Close";

// core components
import Heading from "components/Heading/Heading.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import Instruction from "components/Instruction/Instruction.jsx";

import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

import noticeModal1 from "assets/img/card-1.jpeg";
import noticeModal2 from "assets/img/card-2.jpeg";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tl: false,
      tc: false,
      tr: false,
      bl: false,
      bc: false,
      br: false,
      classicModal: false,
      noticeModal: false,
      smallModal: false
    };
  }
  showNotification(place) {
    if(!this.state[place]){
      var x = [];
      x[place] = true;
      this.setState(x);
      setTimeout(
        function() {
          x[place] = false;
          this.setState(x);
        }.bind(this),
        6000
      );
    }
  }
  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Heading
          title="Notifications"
          textAlign="center"
          category={
            <span>
              Handcrafted by our friends from{" "}
              {
                // eslint-disable-next-line
              }<a target="_blank" href="https://material-ui-next.com/">
                Material UI
              </a>{" "}
              and styled by{" "}
              {
                // eslint-disable-next-line
              }<a target="_blank" href="https://www.creative-tim.com/">
                Creative Tim
              </a>. Please checkout the{" "}
              <a href="#pablo" target="_blank">
                full documentation
              </a>.
            </span>
          }
        />
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={6}>
            <RegularCard
              content={
                <div>
                  <div className={classes.cardHeader}>
                    <h4 className={classes.cardTitle}>Notifications Style</h4>
                  </div>
                  <br />
                  <SnackbarContent
                    message={"This is a plain notification"}
                    color="info"
                  />
                  <SnackbarContent
                    message={"This is a notification with close button."}
                    close
                    color="info"
                  />
                  <br />
                  <SnackbarContent
                    message={
                      "This is a notification with close button and icon and have many lines. You can see that the icon and the close button are always vertically aligned. This is a beautiful notification. So you don't have to worry about the style."
                    }
                    close
                    icon={AddAlert}
                    color="info"
                  />
                  <br />
                  <SnackbarContent
                    message={
                      'This is a notification with close button and icon and is made with color="rose". You can see that the icon and the close button are always vertically aligned. This is a beautiful notification. So you don\'t have to worry about the style.'
                    }
                    close
                    icon={AddAlert}
                    color="rose"
                  />
                </div>
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={6}>
            <RegularCard
              content={
                <div>
                  <div className={classes.cardHeader}>
                    <h4 className={classes.cardTitle}>Notification states</h4>
                  </div>
                  <br />
                  <SnackbarContent
                    message={
                      'INFO - This is a regular notification made with color="info"'
                    }
                    close
                    color="info"
                  />
                  <SnackbarContent
                    message={
                      'SUCCESS - This is a regular notification made with color="success"'
                    }
                    close
                    color="success"
                  />
                  <SnackbarContent
                    message={
                      'WARNING - This is a regular notification made with color="warning"'
                    }
                    close
                    color="warning"
                  />
                  <SnackbarContent
                    message={
                      'DANGER - This is a regular notification made with color="danger"'
                    }
                    close
                    color="danger"
                  />
                  <SnackbarContent
                    message={
                      'PRIMARY - This is a regular notification made with color="primary"'
                    }
                    close
                    color="primary"
                  />
                  <SnackbarContent
                    message={
                      'ROSE - This is a regular notification made with color="primary"'
                    }
                    close
                    color="rose"
                  />
                </div>
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              content={
                <div>
                  <GridContainer justify="center">
                    <ItemGrid xs={12}>
                      <div
                        className={classes.cardHeader + " " + classes.center}
                      >
                        <h4 className={classes.cardTitle}>
                          Notifications Places
                        </h4>
                        <p className={classes.cardSubtitle}>
                          Click to view notifications
                        </p>
                      </div>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer justify="center">
                    <ItemGrid xs={12} sm={12} md={3}>
                      <Button
                        fullWidth
                        color="primary"
                        onClick={() => this.showNotification("tl")}
                      >
                        Top Left
                      </Button>
                      <Snackbar
                        place="tl"
                        color="info"
                        icon={AddAlert}
                        message="Welcome to MATERIAL DASHBOARD React - a beautiful freebie for every web developer."
                        open={this.state.tl}
                        closeNotification={() => this.setState({ tl: false })}
                        close
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={3}>
                      <Button
                        fullWidth
                        color="primary"
                        onClick={() => this.showNotification("tc")}
                      >
                        Top Center
                      </Button>
                      <Snackbar
                        place="tc"
                        color="info"
                        icon={AddAlert}
                        message="Welcome to MATERIAL DASHBOARD React - a beautiful freebie for every web developer."
                        open={this.state.tc}
                        closeNotification={() => this.setState({ tc: false })}
                        close
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={3}>
                      <Button
                        fullWidth
                        color="primary"
                        onClick={() => this.showNotification("tr")}
                      >
                        Top Right
                      </Button>
                      <Snackbar
                        place="tr"
                        color="info"
                        icon={AddAlert}
                        message="Welcome to MATERIAL DASHBOARD React - a beautiful freebie for every web developer."
                        open={this.state.tr}
                        closeNotification={() => this.setState({ tr: false })}
                        close
                      />
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer justify="center">
                    <ItemGrid xs={12} sm={12} md={3}>
                      <Button
                        fullWidth
                        color="primary"
                        onClick={() => this.showNotification("bl")}
                      >
                        Bottom Left
                      </Button>
                      <Snackbar
                        place="bl"
                        color="info"
                        icon={AddAlert}
                        message="Welcome to MATERIAL DASHBOARD React - a beautiful freebie for every web developer."
                        open={this.state.bl}
                        closeNotification={() => this.setState({ bl: false })}
                        close
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={3}>
                      <Button
                        fullWidth
                        color="primary"
                        onClick={() => this.showNotification("bc")}
                      >
                        Bottom Center
                      </Button>
                      <Snackbar
                        place="bc"
                        color="info"
                        icon={AddAlert}
                        message="Welcome to MATERIAL DASHBOARD React - a beautiful freebie for every web developer."
                        open={this.state.bc}
                        closeNotification={() => this.setState({ bc: false })}
                        close
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={3}>
                      <Button
                        fullWidth
                        color="primary"
                        onClick={() => this.showNotification("br")}
                      >
                        Bottom Right
                      </Button>
                      <Snackbar
                        place="br"
                        color="info"
                        icon={AddAlert}
                        message="Welcome to MATERIAL DASHBOARD React - a beautiful freebie for every web developer."
                        open={this.state.br}
                        closeNotification={() => this.setState({ br: false })}
                        close
                      />
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer justify="center">
                    <ItemGrid
                      xs={12}
                      sm={12}
                      md={12}
                      className={classes.center}
                    >
                      <div
                        className={
                          classes.cardHeader +
                          " " +
                          classes.center +
                          " " +
                          classes.modalSectionTitle
                        }
                      >
                        <h4 className={classes.cardTitle}>Modal</h4>
                      </div>
                      <Button
                        color="primary"
                        round
                        customClass={classes.marginRight}
                        onClick={() => this.handleClickOpen("classicModal")}
                      >
                        Classic modal
                      </Button>
                      <Dialog
                        classes={{
                          root: classes.center,
                          paper: classes.modal
                        }}
                        open={this.state.classicModal}
                        transition={Transition}
                        keepMounted
                        onClose={() => this.handleClose("classicModal")}
                        aria-labelledby="classic-modal-slide-title"
                        aria-describedby="classic-modal-slide-description"
                      >
                        <DialogTitle
                          id="classic-modal-slide-title"
                          disableTypography
                          className={classes.modalHeader}
                        >
                          <IconButton
                            className={classes.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => this.handleClose("classicModal")}
                          >
                            <Close className={classes.modalClose} />
                          </IconButton>
                          <h4 className={classes.modalTitle}>Modal title</h4>
                        </DialogTitle>
                        <DialogContent
                          id="classic-modal-slide-description"
                          className={classes.modalBody}
                        >
                          <p>
                            Far far away, behind the word mountains, far from
                            the countries Vokalia and Consonantia, there live
                            the blind texts. Separated they live in
                            Bookmarksgrove right at the coast of the Semantics,
                            a large language ocean. A small river named Duden
                            flows by their place and supplies it with the
                            necessary regelialia. It is a paradisematic country,
                            in which roasted parts of sentences fly into your
                            mouth. Even the all-powerful Pointing has no control
                            about the blind texts it is an almost unorthographic
                            life One day however a small line of blind text by
                            the name of Lorem Ipsum decided to leave for the far
                            World of Grammar.
                          </p>
                        </DialogContent>
                        <DialogActions className={classes.modalFooter}>
                          <Button color="simple">Nice Button</Button>
                          <Button
                            onClick={() => this.handleClose("classicModal")}
                            color="dangerNoBackground"
                          >
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <Button
                        color="info"
                        round
                        customClass={classes.marginRight}
                        onClick={() => this.handleClickOpen("noticeModal")}
                      >
                        Notice Modal
                      </Button>
                      <Dialog
                        classes={{
                          root: classes.center,
                          paper: classes.modal
                        }}
                        open={this.state.noticeModal}
                        transition={Transition}
                        keepMounted
                        onClose={() => this.handleClose("noticeModal")}
                        aria-labelledby="notice-modal-slide-title"
                        aria-describedby="notice-modal-slide-description"
                      >
                        <DialogTitle
                          id="notice-modal-slide-title"
                          disableTypography
                          className={classes.modalHeader}
                        >
                          <IconButton
                            className={classes.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => this.handleClose("noticeModal")}
                          >
                            <Close className={classes.modalClose} />
                          </IconButton>
                          <h4 className={classes.modalTitle}>Notice Modal</h4>
                        </DialogTitle>
                        <DialogContent
                          id="notice-modal-slide-description"
                          className={classes.modalBody}
                        >
                          <Instruction
                            title="1. Register"
                            text={
                              <span>
                                The first step is to create an account at{" "}
                                <a href="http://www.creative-tim.com/">
                                  Creative Tim
                                </a>. You can choose a social network or go for
                                the classic version, whatever works best for
                                you.
                              </span>
                            }
                            image={noticeModal1}
                            className={classes.instructionNoticeModal}
                            imageClassName={classes.imageNoticeModal}
                          />
                          <Instruction
                            title="2. Apply"
                            text={
                              <span>
                                The first step is to create an account at{" "}
                                <a href="http://www.creative-tim.com/">
                                  Creative Tim
                                </a>. You can choose a social network or go for
                                the classic version, whatever works best for
                                you.
                              </span>
                            }
                            image={noticeModal2}
                            className={classes.instructionNoticeModal}
                            imageClassName={classes.imageNoticeModal}
                          />
                          <p>
                            If you have more questions, don't hesitate to
                            contact us or send us a tweet @creativetim. We're
                            here to help!
                          </p>
                        </DialogContent>
                        <DialogActions
                          className={
                            classes.modalFooter +
                            " " +
                            classes.modalFooterCenter
                          }
                        >
                          <Button
                            onClick={() => this.handleClose("noticeModal")}
                            color="info"
                            round
                          >
                            Sounds Good
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <Button
                        color="rose"
                        round
                        customClass={classes.marginRight}
                        onClick={() => this.handleClickOpen("smallModal")}
                      >
                        Small alert modal
                      </Button>
                      <Dialog
                        classes={{
                          root: classes.center,
                          paper: classes.modal + " " + classes.modalSmall
                        }}
                        open={this.state.smallModal}
                        transition={Transition}
                        keepMounted
                        onClose={() => this.handleClose("noticeModal")}
                        aria-labelledby="small-modal-slide-title"
                        aria-describedby="small-modal-slide-description"
                      >
                        <DialogTitle
                          id="small-modal-slide-title"
                          disableTypography
                          className={classes.modalHeader}
                        >
                          <IconButton
                            className={classes.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => this.handleClose("smallModal")}
                          >
                            <Close className={classes.modalClose} />
                          </IconButton>
                        </DialogTitle>
                        <DialogContent
                          id="small-modal-slide-description"
                          className={
                            classes.modalBody + " " + classes.modalSmallBody
                          }
                        >
                          <h5>Are you sure you want to do this?</h5>
                        </DialogContent>
                        <DialogActions
                          className={
                            classes.modalFooter +
                            " " +
                            classes.modalFooterCenter
                          }
                        >
                          <Button
                            onClick={() => this.handleClose("smallModal")}
                            color="simple"
                            customClass={classes.modalSmallFooterFirstButton}
                          >
                            Never Mind
                          </Button>
                          <Button
                            onClick={() => this.handleClose("smallModal")}
                            color="successNoBackground"
                            customClass={
                              classes.modalSmallFooterFirstButton +
                              " " +
                              classes.modalSmallFooterSecondButton
                            }
                          >
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </ItemGrid>
                  </GridContainer>
                </div>
              }
            />
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(notificationsStyle)(Notifications);
