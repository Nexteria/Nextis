import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import Hidden from "material-ui/Hidden";

// core components
import Heading from "components/Heading/Heading.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";

import iconsStyle from "assets/jss/material-dashboard-pro-react/views/iconsStyle";

function Icons({ ...props }) {
  return (
    <GridContainer>
      <ItemGrid xs={12} sm={12} md={12}>
        <Heading
          textAlign="center"
          title="Material Design Icons"
          category={
            <span>
              Handcrafted by our friends from{" "}
              {
                // eslint-disable-next-line
              }<a target="_blank" href="https://design.google.com/icons/">
                Google
              </a>
            </span>
          }
        />
        <RegularCard
          plainCard
          content={
            <div>
              <Hidden only={["sm", "xs"]}>
                <iframe
                  className={props.classes.iframe}
                  src="https://material.io/icons/"
                  title="Icons iframe"
                >
                  <p>Your browser does not support iframes.</p>
                </iframe>
              </Hidden>
              <Hidden only={["lg", "md"]}>
                <ItemGrid xs={12} sm={12} md={6}>
                  <h5>
                    The icons are visible on Desktop mode inside an iframe.
                    Since the iframe is not working on Mobile and Tablets please
                    visit the icons on their original page on Google. Check the
                    <a
                      href="https://design.google.com/icons/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Material Icons
                    </a>
                  </h5>
                </ItemGrid>
              </Hidden>
            </div>
          }
        />
      </ItemGrid>
    </GridContainer>
  );
}

Icons.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(iconsStyle)(Icons);
