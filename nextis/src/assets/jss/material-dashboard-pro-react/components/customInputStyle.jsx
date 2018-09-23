// ##############################
// // // CustomInput styles
// #############################

import {
  primaryColor,
  dangerColor,
  successColor,
  defaultFont
} from "assets/jss/material-dashboard-pro-react.jsx";

const customInputStyle = {
  disabled: {
    "&:before": {
      background: "transparent !important",
      backgroundSize: "3px 1px !important",
      backgroundImage:
        "linear-gradient(to right, rgba(0, 0, 0, 0.23) 33%, transparent 0%) !important",
      backgroundRepeat: "repeat-x !important",
      backgroundPosition: "left top !important"
    }
  },
  underline: {
    "&:before": {
      backgroundColor: "#D2D2D2",
      height: "1px !important"
    },
    "&:after": {
      borderBottom: `2px solid ${primaryColor}`,
      transition: "0.3s ease all"
    }
  },
  underlineError: {
    "&:after": {
      borderBottom: `2px solid ${dangerColor}`,
      transition: "0.3s ease all"
    },
    "&:before": {
      backgroundColor: dangerColor + "!important",
      height: "2px !important"
    }
  },
  underlineSuccess: {
    "&:after": {
      borderBottom: `2px solid ${successColor}`,
      transition: "0.3s ease all"
    }
  },
  labelRoot: {
    ...defaultFont,
    color: "#AAAAAA",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "1.42857",
    transition: "0.3s ease all"
  },
  labelRootError: {
    color: dangerColor
  },
  labelRootSuccess: {
    color: successColor
  },
  feedback: {
    position: "absolute",
    top: "23px",
    right: "0",
    zIndex: "2",
    display: "block",
    width: "24px",
    height: "24px",
    textAlign: "center",
    pointerEvents: "none"
  },
  feedbackNoLabel: {
    // top: "8px"
  },
  input: {
    padding: "2px 0 0",
    fontWeight: "400",
    height: "36px",
    fontSize: "14px",
    lineHeight: "1.428571429",
    color: "#000",
    "&[rows]": {
      height: "auto"
    },
    "&:-webkit-autofill": {
      "-webkit-box-shadow": "0 0 0 30px #392229c4 inset",
    },
  },
  inputNoLabel: {
    paddingTop: "18px"
  },
  inputRTL: {
    textAlign: "right"
  },
  inputWithAdornment: {
    paddingTop: "21px"
  },
  formControl: {
    paddingBottom: "10px",
    position: "relative"
  },
  labelWithAdornment: {
    top: "3px"
  },
  feedbackAdorment: {
    right: "22px"
  }
};

export default customInputStyle;
