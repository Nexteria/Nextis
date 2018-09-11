// ##############################
// // // LoginCard styles
// #############################

import {
  card,
  cardHeader,
  defaultFont,
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  roseCardHeader
} from "assets/jss/material-dashboard-pro-react.jsx";

const loginCardStyle = {
  card: {
    ...card,
    boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
    paddingBottom: "20px",
    transform: "translate3d(0, 0, 0)",
    transition: "all 300ms linear",
    background: "#392229c4",
    color: "#fff"
  },
  cardPlain: {
    background: "transparent",
    boxShadow: "none"
  },
  cardHeader: {
    ...cardHeader,
    ...defaultFont,
    textAlign: "center",
    marginTop: "-40px",
    marginBottom: "20px"
  },
  cardPlainHeader: {
    marginLeft: 0,
    marginRight: 0
  },
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  roseCardHeader,
  cardTitle: {
    ...defaultFont,
    color: "#FFFFFF",
    marginTop: "10px",
    marginBottom: "10px",
    fontWeight: "700",
    fontSize: "1.3em"
  },
  cardSubtitle: {
    ...defaultFont,
    textAlign: "center",
    marginTop: '2em',
    fontSize: '1.5em',
  },
  cardActions: {
    padding: "0",
    display: "block",
    height: "auto"
  },
  cardContent: {
    padding: "0px 30px",
    position: "relative"
  },
  inputAdornmentIcon: {
    color: "#fff"
  },
  left: {
    textAlign: "left"
  },
  right: {
    textAlign: "right"
  },
  center: {
    textAlign: "center"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "3em",
  },
  logo: {
    position: "absolute",
  },
  loginCard: {
    "& input": {
      color: '#ffffff',
    },
  }
};

export default loginCardStyle;
