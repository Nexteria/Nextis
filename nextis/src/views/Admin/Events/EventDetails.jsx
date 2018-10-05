import React from 'react';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';

// core components
import ItemGrid from 'components/Grid/ItemGrid';
import FormLabel from '@material-ui/core/FormLabel';
import GridContainer from 'components/Grid/GridContainer';

const styles = {};

class EventDetails extends React.Component {
  render() {
    const { classes, data } = this.props;

    return (
      <GridContainer>
        <ItemGrid xs={12} sm={2} className={classes.labelRow}>
          <FormLabel
            className={
              classes.labelHorizontal
            }
          >
            Názov
          </FormLabel>
        </ItemGrid>
        <ItemGrid xs={12} sm={10} className={classes.inputRow}>
          asda
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles),
)(EventDetails);
