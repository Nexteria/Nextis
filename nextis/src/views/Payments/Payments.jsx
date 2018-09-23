import React from "react";
import PropTypes from "prop-types";
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from "common/store";
import Spinner from 'react-spinkit';


// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";

// core components

import paymentsStyle from "assets/jss/material-dashboard-pro-react/views/paymentsStyle";

import PaymentsOverview from "views/Payments/PaymentsOverview";
import PaymentCategoriesDetails from "views/Payments/PaymentCategoriesDetails";

class Payments extends React.Component {
  render() {
    const { classes, data } = this.props;
    const { user } = this.props.data;

    if (data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    return (
      <div>
        <PaymentsOverview classes={classes} user={user} />
        <PaymentCategoriesDetails classes={classes} paymentCategories={user.paymentCategories} />
      </div>
    );
  }
}

Payments.propTypes = {
  classes: PropTypes.object.isRequired
};


const userQuery = gql`
query FetchUser ($id: Int){
  user (id: $id){
    id
    balance
    paymentsIban
    paymentCategories {
      id
      name
      variableSymbol
      payments {
        id
        amount
        transactionType
        created_at
        message
        valid_from
      }
    }
    student {
      id
      tuitionFee
      tuitionFeeVariableSymbol
    }
  }
}
`;

export default compose(
  connect(state => ({ user: state.user })),
  withStyles(paymentsStyle),
  graphql(userQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.user.id,
      },
    })
  }),
)(Payments);
