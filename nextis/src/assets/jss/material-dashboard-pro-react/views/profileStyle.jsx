import {
  dangerColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const profileStyle = {
  label: {
    cursor: "pointer",
    paddingLeft: "0",
    color: "rgba(0, 0, 0, 0.26)",
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    display: "inline-flex",
    transition: "0.3s ease all"
  },
  labelHorizontal: {
    color: "rgba(0, 0, 0, 0.26)",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    paddingTop: "39px",
    marginRight: "0",
    "@media (min-width: 992px)": {
      float: "right"
    }
  },
  labelHorizontalRadioCheckbox:{
    paddingTop: "22px",
  },
  labelLeftHorizontal: {
    color: "rgba(0, 0, 0, 0.26)",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "14px",
    lineHeight: "1.428571429",
    fontWeight: "400",
    paddingTop: "22px",
    marginRight: "0"
  },
  labelError: {
    color: dangerColor
  },
  profileForm: {
    '& input': {
      color: '#333',
    },
  },
  underline: {
    "&:before": {
      backgroundColor: "#ccc",
      height: "1px !important"
    },
    "&:after": {
      backgroundColor: '#ff9920',
      transition: "0.3s ease all"
    }
  },
  textEditor: {
    marginTop: '2em',
  },
  textEditorToolbar: {
    textAlign: 'left',
  },
  img: {
    width: "100%",
    height: "auto",
    verticalAlign: "middle",
    border: "0"
  },
  inputErrorContainer: {
    color: dangerColor,
  },
  labelErrorContainer: {
    color: dangerColor,
  },
  buttonSpinner: {
    '& > div': {
      height: '1em',
      marginTop: 0,
      marginBottom: 0,
    },
    width: '12em',
  },
};

export default profileStyle;
