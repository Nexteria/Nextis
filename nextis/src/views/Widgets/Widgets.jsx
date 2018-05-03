import React from "react";

// material-ui icons
import Weekend from "@material-ui/icons/Weekend";
import Home from "@material-ui/icons/Home";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import HeaderCard from "components/Cards/HeaderCard.jsx";
import TasksCard from "components/Cards/TasksCard.jsx";
import PricingCard from "components/Cards/PricingCard.jsx";
import TestimonialCard from "components/Cards/TestimonialCard.jsx";
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Timeline from "components/Timeline/Timeline.jsx";

import { widgetStories, bugs, website, server } from "variables/general.jsx";

import image from "assets/img/faces/card-profile1-square.jpg";

class Widgets extends React.Component {
  render() {
    return (
      <div>
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={6}>
            <HeaderCard
              headerColor="orange"
              cardTitle="Employees Stats"
              cardSubtitle="New employees on 15th September, 2016"
              content={
                <Table
                  hover
                  tableHeaderColor="warning"
                  tableHead={["ID", "Name", "Salary", "Country"]}
                  tableData={[
                    ["1", "Dakota Rice", "$36,738", "Niger"],
                    ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    ["4", "Philip Chaney", "$38,735", "Korea, South"]
                  ]}
                />
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={6}>
            <TasksCard
              headerColor="rose"
              title="Tasks:"
              tabs={[
                {
                  tabName: "Bugs",
                  tabIcon: BugReport,
                  tabTasks: bugs,
                  tabTasksIndexes: [0, 1, 2, 3],
                  tabTasksChekedIndexes: [0, 3]
                },
                {
                  tabName: "Website",
                  tabIcon: Code,
                  tabTasks: website,
                  tabTasksIndexes: [0, 1],
                  tabTasksChekedIndexes: [0]
                },
                {
                  tabName: "Server",
                  tabIcon: Cloud,
                  tabTasks: server,
                  tabTasksIndexes: [0, 1, 2],
                  tabTasksChekedIndexes: [1]
                }
              ]}
            />
          </ItemGrid>
        </GridContainer>
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={6}>
            <GridContainer>
              <ItemGrid xs={12} sm={12} lg={6}>
                <PricingCard
                  title="SMALL COMPANY"
                  price="$29"
                  description="This is good if your company size is between 2 and 10 Persons."
                  icon={Home}
                  iconColor="rose"
                  footer={
                    <Button round color="rose">
                      Choose plan
                    </Button>
                  }
                />
              </ItemGrid>
              <ItemGrid xs={12} sm={12} lg={6}>
                <PricingCard
                  plain
                  title="FREELANCER"
                  price="FREE"
                  whitePrice={false}
                  description="This is good if your company size is between 2 and 10 Persons."
                  icon={Weekend}
                  iconColor="gray"
                  footer={
                    <Button round color="white">
                      Choose plan
                    </Button>
                  }
                />
              </ItemGrid>
              <ItemGrid xs={12} sm={12} md={11}>
                <TestimonialCard
                  cardDescription="Your products, all the kits that I have downloaded from your site and worked with are sooo cool! I love the color mixtures, cards... everything. Keep up the great work!"
                  cardTitle="Alec Thompson"
                  cardSubtitle="@ALECTHOMPSON"
                  imageAlt="..."
                  image={image}
                />
              </ItemGrid>
            </GridContainer>
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={6}>
            <Timeline simple stories={widgetStories} />
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}

export default Widgets;
