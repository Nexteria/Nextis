import modalStyle from "assets/jss/material-dashboard-pro-react/modalStyle.jsx";

const locationsEditStyles = {
  labelHorizontal: {
    marginTop: '1em',
  },
  ...modalStyle,
  modalCloseButton: {
    float: 'right',
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

export default locationsEditStyles;
