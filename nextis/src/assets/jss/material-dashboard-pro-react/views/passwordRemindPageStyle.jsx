// ##############################
// // // LoginPage view styles
// #############################

import { container, nexteriaOrangeColor } from "assets/jss/material-dashboard-pro-react.jsx";

const loginPageStyle = {
  wrapper: {
    height: "auto",
    minHeight: "100vh",
    position: "relative",
    top: "0",
    overflow: "hidden"
  },
  fullPage: {
    "&:before": {
      backgroundColor: "rgba(0, 0, 0, 0.2)"
    },
    "&:before,&:after": {
      display: "block",
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "0",
      left: "0",
      zIndex: "2"
    }
  },
  fullPageBackground: {
    position: "absolute",
    zIndex: "1",
    height: "100%",
    width: "100%",
    display: "block",
    top: "0",
    left: "0",
    backgroundSize: "cover",
    backgroundPosition: "center center"
  },
  content: {
    paddingTop: "18vh",
    minHeight: "calc(100vh - 80px)",
    position: "relative",
    zIndex: "4"
  },
  container,
  customButtonClass: {
    "&,&:focus,&:hover":{
      color: "#FFFFFF",
    },
    marginLeft: "5px",
    marginRight: "5px"
  },
  inputAdornment: {
    marginRight: "18px"
  },
  inputAdornmentIcon: {
    color: "#fff"
  },
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)"
  },
  underline: {
    "&:before": {
      backgroundColor: "#fff",
      height: "1px !important"
    },
    "&:after": {
      backgroundColor: '#ff9920',
      transition: "0.3s ease all"
    }
  },
  loginError: {
    textAlign: 'center',
    color: nexteriaOrangeColor,
  },
  resetPassword: {
    color: nexteriaOrangeColor,
    '&:hover': {
      color: '#ffffff',
    },
  },
  resetPasswordContainer: {
    textAlign: 'right',
  }
};

export default loginPageStyle;
