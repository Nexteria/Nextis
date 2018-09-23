import React from "react";

// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import AccountBalance from "@material-ui/icons/AccountBalance";
import AttachMoney from "@material-ui/icons/AttachMoney";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import Typography from "@material-ui/core/Typography";


export default class PaymentsOverview extends React.Component {
  render() {
    const { classes, user } = this.props;

    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={6} md={6} lg={4}>
          <IconCard
            icon={AccountBalance}
            iconColor="orange"
            title={
              <Typography component="div" className={classes.cardCategory}>
                <div>Pokyny k platbe</div>
              </Typography>
            }
            content={
              <div className={classes.center}>
                <div>IBAN: {user.paymentsIban}</div>
                <div>VS: {user.student ? user.student.tuitionFeeVariableSymbol : '-'}</div>
              </div>
            }
          />
        </ItemGrid>
        <ItemGrid xs={12} sm={6} md={6} lg={4}>
          <IconCard
            icon={Assignment}
            iconColor="orange"
            title={
              <Typography component="div" className={classes.cardCategory}>
                <div>Stav účtu</div>
                <div className={classes.balance}>
                  <span className={user.balance < 0 ? classes.negative : classes.positive}>
                    {user.balance > 0 ? '+' : ''}
                    {user.balance / 100}
                  </span>
                  <span className={classes.euroSign}>€</span>
                </div>
              </Typography>
            }
            content={""}
          />
        </ItemGrid>
        <ItemGrid xs={12} sm={6} md={6} lg={4}>
          <IconCard
            icon={AttachMoney}
            iconColor="orange"
            title={
              <Typography component="div" className={classes.cardCategory}>
                <div>Mesačné členské</div>
              </Typography>
            }
            content={
              <div className={classes.center}>
                <span>{user.student ? (user.student.tuitionFee / 100) : '-'}</span>
                <span className={classes.euroSign}>€</span>
              </div>
            }
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}
