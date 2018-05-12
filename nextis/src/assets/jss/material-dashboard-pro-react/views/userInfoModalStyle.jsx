// ##############################
// // // Notifications view styles
// #############################

import { defaultFont } from "assets/jss/material-dashboard-pro-react.jsx";
import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.jsx";

const userInfoModalStyle = {
  cardTitle: {
    marginTop: "0",
    marginBottom: "3px",
    color: "#3C4858",
    fontSize: "18px"
  },
  cardHeader: {
    zIndex: "3"
  },
  cardSubtitle: {
    ...defaultFont,
    color: "#999999",
    fontSize: "14px",
    margin: "0 0 10px"
  },
  center: {
    textAlign: "center",
  },
  right: {
    textAlign: "right"
  },
  left: {
    textAlign: "left"
  },
  marginRight: {
    marginRight: "5px"
  },
  modalSectionTitle: {
    marginTop: "30px"
  },
  ...modalStyle,
  modal: {
    ...modalStyle.modal,
    overflow: "visible",
    maxWidth: '25em',
    minWidth: '20em',
  },
  modalBody: {
    ...modalStyle.modalBody,
    textAlign: "left",
    '& label': {
      fontWeight: 'bold',
      fontSize: '1em',
    }
  },
  cardAvatar: {
    marginTop: "10px",
    marginBottom: "-50px",
    maxWidth: "100px",
    maxHeight: "100px",
    margin: "-50px auto 0",
    borderRadius: "50%",
    overflow: "hidden",
    position: 'relative',
    top: "-4em",
    boxShadow:
      "0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  img: {
    width: "100%",
    height: "auto",
    verticalAlign: "middle",
    border: "0"
  },
  sectionContainer: {
    display: 'flex',
    alignItems: 'center',
    '& label': {
      fontWeight: 'bold',
      color: '#3c4858',
    },
  },
  sectionIcon: {
    fontSize: '1em',
    marginRight: '0.5em',
  },
  socialButtons: {
    margin: 0,
    padding: 0,
  },
  userName: {
    margin: 0,
    position: 'relative',
    top: '0',
  },
};

export default userInfoModalStyle;
