import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// @material-ui/icons
import Timeline from "@material-ui/icons/Timeline";

// core components
import Heading from "components/Heading/Heading.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import ChartCard from "components/Cards/ChartCard.jsx";
import IconCard from "components/Cards/IconCard.jsx";

import {
  roundedLineChart,
  straightLinesChart,
  simpleBarChart,
  colouredLineChart,
  multipleBarsChart,
  colouredLinesChart,
  pieChart
} from "variables/charts.jsx";

import chartsStyle from "assets/jss/material-dashboard-pro-react/views/chartsStyle.jsx";

class Charts extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Heading
          textAlign="center"
          title="React Chartist"
          category={
            <span>
              A react wrapper for{" "}
              <a
                target="_blank"
                href="https://gionkunz.github.io/chartist-js/"
                rel="noopener noreferrer"
              >
                Chartist.js
              </a>. Please checkout the{" "}
              <a
                href="https://gionkunz.github.io/chartist-js/getting-started.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                full documentation of Chartist.js
              </a>{" "}
              and{" "}
              <a
                href="https://fraserxu.me/react-chartist/"
                target="_blank"
                rel="noopener noreferrer"
              >
                full documentation of react-cahrtist
              </a>.
            </span>
          }
        />
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart-white-colors"
                  data={roundedLineChart.data}
                  type="Line"
                  options={roundedLineChart.options}
                  listener={roundedLineChart.animation}
                />
              }
              chartColor="rose"
              title="Rounded Line Chart"
              text="Line Chart"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart-white-colors"
                  data={straightLinesChart.data}
                  type="Line"
                  options={straightLinesChart.options}
                  listener={straightLinesChart.animation}
                />
              }
              chartColor="orange"
              title="Straight Lines Chart"
              text="Line Chart with Points"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart-white-colors"
                  data={simpleBarChart.data}
                  type="Bar"
                  options={simpleBarChart.options}
                  responsiveOptions={simpleBarChart.responsiveOptions}
                  listener={simpleBarChart.animation}
                />
              }
              chartColor="blue"
              title="Simple Bar Chart"
              text="Bar Chart"
            />
          </ItemGrid>
        </GridContainer>
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={6}>
            <IconCard
              icon={Timeline}
              title="Coloured Line Chart "
              category="- Rounded"
              iconColor="blue"
              content={
                <ChartistGraph
                  data={colouredLineChart.data}
                  type="Line"
                  options={colouredLineChart.options}
                  listener={colouredLineChart.animation}
                />
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={6}>
            <IconCard
              icon={Timeline}
              iconColor="rose"
              title="Multiple Bars Chart "
              category="- Bar Chart"
              content={
                <ChartistGraph
                  data={multipleBarsChart.data}
                  type="Bar"
                  options={multipleBarsChart.options}
                  listener={multipleBarsChart.animation}
                />
              }
            />
          </ItemGrid>
        </GridContainer>
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={7}>
            <IconCard
              icon={Timeline}
              title="Coloured Lines Chart "
              category="- Rounded"
              iconColor="blue"
              content={
                <ChartistGraph
                  data={colouredLinesChart.data}
                  type="Line"
                  options={colouredLinesChart.options}
                  listener={colouredLinesChart.animation}
                />
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={5}>
            <IconCard
              icon={Timeline}
              iconColor="red"
              title="Pie Chart"
              content={
                <ChartistGraph
                  data={pieChart.data}
                  type="Pie"
                  options={pieChart.options}
                />
              }
              footer={
                <div>
                  <h6 className={classes.legendTitle}>Legend</h6>
                  <i className={"fas fa-circle " + classes.info} /> Apple{` `}
                  <i
                    className={"fas fa-circle " + classes.warning}
                  /> Samsung{` `}
                  <i className={"fas fa-circle " + classes.danger} /> Windows
                  Phone{` `}
                </div>
              }
            />
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(chartsStyle)(Charts);
