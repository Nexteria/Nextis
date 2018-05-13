import {
  successColor,
  dangerColor,
  defaultFont,
  grayColor,
} from "assets/jss/material-dashboard-pro-react.jsx";

const paymentsStyle = {
  euroSign: {
    fontSize: '0.8em',
  },
  positive: {
    color: successColor,
  },
  negative: {
    color: dangerColor,
  },
  cardCategory: {
    marginBottom: "0",
    color: grayColor,
    margin: "0 0 10px",
    ...defaultFont,
    fontSize: '1em',
    textAlign: 'center',
    paddingRight: '2em',
  },
  balance: {
    fontSize: '1.2em',
  },
  categoryBalance: {
    float: 'right',
    marginRight: '2em',
  },
  fullWidth: {
    width: '100%',
  },
  center: {
    textAlign: 'center',
  }
};

export default paymentsStyle;
