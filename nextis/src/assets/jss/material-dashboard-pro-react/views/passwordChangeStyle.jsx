import {
  dangerColor,
} from 'assets/jss/material-dashboard-pro-react';

const passwordChangeStyle = {
  label: {
    cursor: 'pointer',
    paddingLeft: '0',
    color: 'rgba(0, 0, 0, 0.26)',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    display: 'inline-flex',
    transition: '0.3s ease all'
  },
  labelHorizontal: {
    color: 'rgba(0, 0, 0, 0.26)',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '14px',
    lineHeight: '1.428571429',
    fontWeight: '400',
    paddingTop: '39px',
    marginRight: '0',
    '@media (min-width: 992px)': {
      float: 'right'
    }
  },
  labelError: {
    color: dangerColor,
  },
  underline: {
    '&:before': {
      backgroundColor: '#ccc',
      height: '1px !important'
    },
    '&:after': {
      backgroundColor: '#ff9920',
      transition: '0.3s ease all'
    }
  },
  inputErrorContainer: {
    color: dangerColor,
  },
  labelErrorContainer: {
    color: dangerColor,
  },
  actionButtonContainer: {
    textAlign: 'center'
  }
};

export default passwordChangeStyle;
