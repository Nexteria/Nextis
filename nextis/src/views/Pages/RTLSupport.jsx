import React from "react";

// @material-ui/icons
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
import Timeline from "components/Timeline/Timeline.jsx";
import Button from "components/CustomButtons/Button.jsx";

import {
  rtlStories,
  rtlBugs,
  rtlWebsite,
  rtlServer
} from "variables/general.jsx";

import image from "assets/img/faces/card-profile1-square.jpg";

class RTLSupport extends React.Component {
  render() {
    return (
      <div>
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={12} lg={6}>
            <HeaderCard
              headerColor="orange"
              cardTitle="لتكاليف يبق"
              cardSubtitle="بالإنزال وفي. خيار ومضى العمليات تم ذلك, تم معقل مرمى"
              content={
                <Table
                  hover
                  tableHeaderColor="warning"
                  tableHead={[
                    "وتم",
                    "لأمريكية هذا",
                    "شاسعالأمريكية",
                    "الأمريكية "
                  ]}
                  tableData={[
                    ["وا حد", "السبب وفرنسا الصينية ", "$36,738", "تكاليف"],
                    ["إثنان", "بمباركة بها ", "$23,789", "الأمريكية من"],
                    ["ثلاثة", " شاسعالأمريكية ", "$56,142", "السفن وعُرفت"],
                    ["أربعة", " الاندونيسية", "$38,735", " فصل."]
                  ]}
                />
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={12} lg={6}>
            <TasksCard
              rtlActive
              headerColor="rose"
              title="منتصف:"
              tabs={[
                {
                  tabName: "ضرب",
                  tabIcon: BugReport,
                  tabTasks: rtlBugs,
                  tabTasksIndexes: [0, 1, 2, 3],
                  tabTasksChekedIndexes: [0, 3]
                },
                {
                  tabName: "السفن",
                  tabIcon: Code,
                  tabTasks: rtlWebsite,
                  tabTasksIndexes: [0, 1],
                  tabTasksChekedIndexes: [0]
                },
                {
                  tabName: "فصل.",
                  tabIcon: Cloud,
                  tabTasks: rtlServer,
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
                  title="جيوب سليمان، الإنزال"
                  price="$29"
                  description="الأجل المتساقطة، من. عرض بسبب وأكثرها الاندونيسية بـ."
                  icon={Home}
                  iconColor="rose"
                  footer={
                    <Button round color="rose">
                      حاملات فعل
                    </Button>
                  }
                />
              </ItemGrid>
              <ItemGrid xs={12} sm={12} lg={6}>
                <PricingCard
                  plain
                  title="المتحدة لتقليعة"
                  price="قائمة"
                  whitePrice={false}
                  description="الأجل المتساقطة، من. عرض بسبب وأكثرها الاندونيسية بـ."
                  icon={Weekend}
                  iconColor="gray"
                  footer={
                    <Button round color="white">
                      حاملات فعل
                    </Button>
                  }
                />
              </ItemGrid>
              <ItemGrid xs={12} sm={12} md={11}>
                <TestimonialCard
                  cardDescription="بعد و وسوء الأحمر, دون عقبت الهادي أم, قد حول قادة حكومة يتعلّق. أخذ حصدت اوروبا أن, كلا مهمّات اسبوعين التخطيط عل. وإيطالي الأوروبي و نفس. صفحة احداث أضف ان, هو مرجع نهاية لهيمنة كما. تم مايو لفشل المدن دول, جعل أن عسكرياً التّحول استرجاع."
                  cardTitle="أليك طومسون"
                  cardSubtitle="أليك طومسون@"
                  imageAlt="..."
                  image={image}
                />
              </ItemGrid>
            </GridContainer>
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={6}>
            <Timeline simple stories={rtlStories} />
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}

export default RTLSupport;
