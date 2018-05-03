import React from "react";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import Heading from "components/Heading/Heading.jsx";
import Timeline from "components/Timeline/Timeline.jsx";

import { stories } from "variables/general.jsx";

class TimelinePage extends React.Component {
  render() {
    return (
      <div>
        <Heading title="Timeline" textAlign="center" />
        <GridContainer>
          <ItemGrid xs={12}>
            <RegularCard plainCard content={<Timeline stories={stories} />} />
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}

export default TimelinePage;
