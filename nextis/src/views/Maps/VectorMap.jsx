import React from "react";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import Heading from "components/Heading/Heading.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};

function VectorMaps({ ...prop }) {
  return (
    <div>
      <Heading
        textAlign="center"
        title="World Map"
        category={
          // eslint-disable-next-line
          <span>
            {
              // eslint-disable-next-line
            }<a href="https://www.npmjs.com/package/react-jvectormap" target="_blank">
              React wrapper component
            </a>{" "}
            of jQuery{" "}
            {
              // eslint-disable-next-line
            }<a href="http://jvectormap.com/" target="_blank">
              jVector Map
            </a>{" "}
            pluging.
          </span>
        }
      />
      <GridContainer>
        <ItemGrid xs={12}>
          <RegularCard
            plainCard
            content={
              <VectorMap
                map={"world_mill"}
                backgroundColor="transparent"
                zoomOnScroll={false}
                containerStyle={{
                  width: "100%",
                  height: "420px"
                }}
                containerClassName="map"
                regionStyle={{
                  initial: {
                    fill: "#e4e4e4",
                    "fill-opacity": 0.9,
                    stroke: "none",
                    "stroke-width": 0,
                    "stroke-opacity": 0
                  }
                }}
                series={{
                  regions: [
                    {
                      values: mapData,
                      scale: ["#AAAAAA", "#444444"],
                      normalizeFunction: "polynomial"
                    }
                  ]
                }}
              />
            }
          />
        </ItemGrid>
      </GridContainer>
    </div>
  );
}

export default VectorMaps;
