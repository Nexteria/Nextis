import React from "react";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import Table from "components/Table/Table.jsx";

const style = {
  customCardContentClass: {
    paddingLeft: "0",
    paddingRight: "0"
  }
};

function RegularTables({ ...props }) {
  const { classes } = props;
  return (
    <GridContainer>
      <ItemGrid xs={12}>
        <IconCard
          icon={Assignment}
          iconColor="rose"
          title="Simple Table"
          content={
            <Table
              tableHeaderColor="primary"
              tableHead={["Name", "Country", "City", "Salary"]}
              tableData={[
                ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
                ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
                ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
                ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
                ["Doris Greene", "Malawi", "Feldkirchen in Kärnten", "$63,542"],
                ["Mason Porter", "Chile", "Gloucester", "$78,615"]
              ]}
              coloredColls={[3]}
              colorsColls={["primary"]}
            />
          }
        />
      </ItemGrid>
      <ItemGrid xs={12}>
        <IconCard
          icon={Assignment}
          iconColor="rose"
          title="Table on Plain Background"
          category=" - Here is a subtitle for this table"
          plain
          content={
            <Table
              hover
              tableHead={["ID", "Name", "Salary", "Country", "City"]}
              tableData={[
                ["1", "Dakota Rice", "$36,738", "Niger", "Oud-Turnhout"],
                ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
                [
                  "4",
                  "Philip Chaney",
                  "$38,735",
                  "Korea, South",
                  "Overland Park"
                ],
                [
                  "5",
                  "Doris Greene",
                  "$63,542",
                  "Malawi",
                  "Feldkirchen in Kärnten"
                ],
                ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"]
              ]}
            />
          }
        />
      </ItemGrid>
      <ItemGrid xs={12}>
        <IconCard
          customCardContentClass={classes.customCardContentClass}
          icon={Assignment}
          iconColor="rose"
          title="Regular Table with Colors"
          content={
            <Table
              hover
              tableHead={["ID", "Name", "Salary", "Country", "City"]}
              tableData={[
                {
                  color: "success",
                  data: [
                    "1",
                    "Dakota Rice (Success)",
                    "$36,738",
                    "Niger",
                    "Oud-Turnhout"
                  ]
                },
                ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                {
                  color: "info",
                  data: [
                    "3",
                    "Sage Rodriguez (Info)",
                    "$56,142",
                    "Netherlands",
                    "Baileux"
                  ]
                },
                [
                  "4",
                  "Philip Chaney",
                  "$38,735",
                  "Korea, South",
                  "Overland Park"
                ],
                {
                  color: "danger",
                  data: [
                    "5",
                    "Doris Greene (Danger)",
                    "$63,542",
                    "Malawi",
                    "Feldkirchen in Kärnten"
                  ]
                },
                ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"],
                {
                  color: "warning",
                  data: [
                    "7",
                    "Mike Chaney (Warning)",
                    "$38,735",
                    "Romania",
                    "Bucharest"
                  ]
                }
              ]}
            />
          }
        />
      </ItemGrid>
    </GridContainer>
  );
}

export default withStyles(style)(RegularTables);
