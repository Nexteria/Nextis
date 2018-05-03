import React from "react";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Grid from "material-ui/Grid";

const style = {
  grid: {
    padding: "0 15px !important"
  }
};

function ItemGrid({ ...props }) {
  const { classes, children, className, ...rest } = props;
  return (
    <Grid item {...rest} className={classes.grid + " " + className}>
      {children}
    </Grid>
  );
}

export default withStyles(style)(ItemGrid);
