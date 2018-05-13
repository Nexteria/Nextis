import React from "react";
import parse from 'date-fns/parse';
import isPast from 'date-fns/is_past';

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import Table from "components/Table/Table.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import Accordion from "components/Accordion/Accordion.jsx";

export default class PaymentCategoriesDetails extends React.Component {
  transformCategoryPaymentRow(payment, classes) {
    const colorClass = payment.transactionType === 'debet' ? classes.negative : classes.positive;
    return [
      payment.message,
      payment.created_at,
      <div className={classes.balance + " " + colorClass}>
        <span>
          {payment.transactionType === 'debet' ? '-' : ''}
          {payment.transactionType === 'kredit' ? '+' : ''}
          {payment.amount / 100}
        </span>
        <span className={classes.euroSign}>€</span>
      </div>,
    ];
  }

  processPaymentData(paymentCategories) {
    return paymentCategories.map(category => {
      let result = {
        total: 0,
        name: category.name,
        variableSymbol: category.variableSymbol,
        payments: [],
      }

      category.payments.forEach(payment => {
        if (payment.valid_from) {
          const paymentDate = parse(payment.valid_from, 'YYYY-MM-DD');
          if (!isPast(paymentDate)) {
            return;
          }
        }

        if (payment.transactionType === 'kredit') {
          result.total += payment.amount;
        } else {
          result.total -= payment.amount;
        }

        result.payments.push(payment);
      });

      result.payments.sort((a, b) => b.created_at.localeCompare(a.created_at));

      return result;
    });
  }

  render() {
    const { classes, paymentCategories } = this.props;

    const categories = this.processPaymentData(paymentCategories);

    return (
      <GridContainer justify="center">
        <ItemGrid xs={12} sm={12} md={8}>
          <RegularCard
            cardTitle="Kategórie"
            content={
              <Accordion
                active={null}
                collapses={categories.map(category => {
                  return {
                    title: <div>
                      {category.name}
                      <div className={classes.categoryBalance}>
                        <span className={category.total < 0 ? classes.negative : classes.positive}>
                          {category.total > 0 ? '+' : ''}
                          {category.total / 100}
                        </span>
                        <span className={classes.euroSign}> €</span>
                      </div>
                    </div>,
                    content:
                      <Table
                        className={classes.fullWidth}
                        tableHead={[
                          "Správa",
                          "Dátum pripísania",
                          "Suma",
                        ]}
                        tableData={
                          category.payments.map(payment =>
                            this.transformCategoryPaymentRow(payment, classes)
                          )
                        }
                      />
                  };
                })}
              />
            }
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}
