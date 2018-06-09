import {
  dangerColor,
  boxShadow,
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
    height: '100%',
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
  avatarContainer: {
    position: 'relative',
    width: '130px',
    height: '130px',
  },
  avatarChangeButton: {
    position: 'absolute',
    left: 0,
    top: '50%',
    width: '100%',
  },
  confirmButtonContainer: {
    position: 'absolute',
    left: '20%',
    top: '65%',
    '& button': {
      display: 'inline',
      width: '30px',
      height: '30px',
      minWidth: '30px',
      margin: '5px',
      '& > span': {
        position: 'relative',
        top: '-7px',
        left: '0px',
      }
    },
  },
  skillsProfileCard: {
    "&:hover": {
      ...boxShadow,
      cursor: "pointer",
    }
  }
};

export default profileStyle;
