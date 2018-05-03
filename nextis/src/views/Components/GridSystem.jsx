import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// core components
import RegularCard from "components/Cards/RegularCard.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";

import gridSystemStyle from "assets/jss/material-dashboard-pro-react/views/gridSystemStyle.jsx";

class GridSystem extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <h4 className={classes.title}>
          XS Grid <small>Always Horizontal</small>
        </h4>
        <GridContainer>
          <ItemGrid xs={4}>
            <RegularCard
              content={<code>{`xs={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={4}>
            <RegularCard
              content={<code>{`xs={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={4}>
            <RegularCard
              content={<code>{`xs={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
        </GridContainer>
        <h4 className={classes.title}>
          SM Grid <small>Collapsed at 768px</small>
        </h4>
        <GridContainer>
          <ItemGrid xs={12} sm={4}>
            <RegularCard
              content={<code>{`sm={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={4}>
            <RegularCard
              content={<code>{`sm={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={4}>
            <RegularCard
              content={<code>{`sm={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
        </GridContainer>
        <h4 className={classes.title}>
          MD Grid <small>Collapsed at 992px</small>
        </h4>
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={4}>
            <RegularCard
              content={<code>{`md={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <RegularCard
              content={<code>{`md={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <RegularCard
              content={<code>{`md={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
        </GridContainer>
        <h4 className={classes.title}>
          LG Grid <small>Collapsed at 1200px</small>
        </h4>
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={12} lg={4}>
            <RegularCard
              content={<code>{`lg={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={12} lg={4}>
            <RegularCard
              content={<code>{`lg={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={12} lg={4}>
            <RegularCard
              content={<code>{`lg={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
        </GridContainer>
        <h4 className={classes.title}>
          Mixed Grid <small>Showing different sizes on different screens</small>
        </h4>
        <GridContainer>
          <ItemGrid xs={12} sm={6} md={6} lg={3}>
            <RegularCard
              content={<code>{`sm={6} lg={3}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={6} lg={3}>
            <RegularCard
              content={<code>{`sm={6} lg={3}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={6} lg={3}>
            <RegularCard
              content={<code>{`sm={6} lg={3}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={6} lg={3}>
            <RegularCard
              content={<code>{`sm={6} lg={3}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
        </GridContainer>
        <h4 className={classes.title}>
          Offset Grid <small>Adding some space when needed</small>
        </h4>
        <GridContainer
          justify="space-between"
          alignItems="center"
          direction="row"
        >
          <ItemGrid xs={12} sm={12} md={3}>
            <RegularCard
              content={<code>{`md={3}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={3}>
            <RegularCard
              content={<code>{`md={3}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={3}>
            <RegularCard
              content={<code>{`md={3}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
        </GridContainer>
        <GridContainer justify="space-between">
          <ItemGrid xs={12} sm={12} md={4}>
            <RegularCard
              content={<code>{`md={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <RegularCard
              content={<code>{`md={4}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
        </GridContainer>
        <GridContainer justify="center">
          <ItemGrid xs={12} sm={12} md={6}>
            <RegularCard
              content={<code>{`md={6}`}</code>}
              contentAlign="center"
            />
          </ItemGrid>
        </GridContainer>
        <h4 className={classes.title}>Paragraphs</h4>
        <RegularCard
          content={
            <div>
              <GridContainer>
                <ItemGrid xs={12} sm={6}>
                  <h3>Some Title Here</h3>
                  <p>
                    One morning, when Gregor Samsa woke from troubled dreams, he
                    found himself transformed in his bed into a horrible vermin.
                    He lay on his armour-like back, and if he lifted his head a
                    little he could see his brown belly, slightly domed and
                    divided by arches into stiff sections. The bedding was
                    hardly able to cover it and seemed ready to slide off any
                    moment. His many legs, pitifully thin compared with the size
                    of the rest of him, waved about helplessly as he looked.
                    "What's happened to me?" he thought.
                  </p>
                </ItemGrid>
                <ItemGrid xs={12} sm={6}>
                  <h3>Another Title Here</h3>
                  <p>
                    One morning, when Gregor Samsa woke from troubled dreams, he
                    found himself transformed in his bed into a horrible vermin.
                    He lay on his armour-like back, and if he lifted his head a
                    little he could see his brown belly, slightly domed and
                    divided by arches into stiff sections. The bedding was
                    hardly able to cover it and seemed ready to slide off any
                    moment. His many legs, pitifully thin compared with the size
                    of the rest of him, waved about helplessly as he looked.
                    "What's happened to me?" he thought.
                  </p>
                </ItemGrid>
              </GridContainer>
              <br />
              <GridContainer>
                <ItemGrid xs={12} sm={4}>
                  <h3>Some Title Here</h3>
                  <p>
                    One morning, when Gregor Samsa woke from troubled dreams, he
                    found himself transformed in his bed into a horrible vermin.
                    He lay on his armour-like back, and if he lifted his head a
                    little he could see his brown belly, slightly domed and
                    divided by arches into stiff sections. The bedding was
                    hardly able to cover it and seemed ready to slide off any
                    moment.
                  </p>
                </ItemGrid>
                <ItemGrid xs={12} sm={4}>
                  <h3>Another Title Here</h3>
                  <p>
                    One morning, when Gregor Samsa woke from troubled dreams, he
                    found himself transformed in his bed into a horrible vermin.
                    He lay on his armour-like back, and if he lifted his head a
                    little he could see his brown belly, slightly domed and
                    divided by arches into stiff sections. The bedding was
                    hardly able to cover it and seemed ready to slide off any
                    moment.
                  </p>
                </ItemGrid>
                <ItemGrid xs={12} sm={4}>
                  <h3>Another Title Here</h3>
                  <p>
                    One morning, when Gregor Samsa woke from troubled dreams, he
                    found himself transformed in his bed into a horrible vermin.
                    He lay on his armour-like back, and if he lifted his head a
                    little he could see his brown belly, slightly domed and
                    divided by arches into stiff sections. The bedding was
                    hardly able to cover it and seemed ready to slide off any
                    moment.
                  </p>
                </ItemGrid>
              </GridContainer>
              <br />
              <GridContainer>
                <ItemGrid xs={12} sm={4}>
                  <h3>Some Title Here</h3>
                  <p>
                    One morning, when Gregor Samsa woke from troubled dreams, he
                    found himself transformed in his bed into a horrible vermin.
                    He lay on his armour-like back, and if he lifted his head a
                    little he could see his brown belly, slightly domed and
                    divided by arches into stiff sections. The bedding was
                    hardly able to cover it and seemed ready to slide off any
                    moment.
                  </p>
                </ItemGrid>
                <ItemGrid xs={12} sm={8}>
                  <h3>Another Title Here</h3>
                  <p>
                    One morning, when Gregor Samsa woke from troubled dreams, he
                    found himself transformed in his bed into a horrible vermin.
                    He lay on his armour-like back, and if he lifted his head a
                    little he could see his brown belly, slightly domed and
                    divided by arches into stiff sections. The bedding was
                    hardly able to cover it and seemed ready to slide off any
                    moment. One morning, when Gregor Samsa woke from troubled
                    dreams, he found himself transformed in his bed into a
                    horrible vermin. He lay on his armour-like back, and if he
                    lifted his head a little he could see his brown belly,
                    slightly domed and divided by arches into stiff sections.
                    The bedding was hardly able to cover it and seemed ready to
                    slide off any moment.
                  </p>
                </ItemGrid>
              </GridContainer>
            </div>
          }
        />
      </div>
    );
  }
}

GridSystem.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(gridSystemStyle)(GridSystem);
