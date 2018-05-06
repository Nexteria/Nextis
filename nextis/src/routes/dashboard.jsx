import Dashboard from "views/Dashboard/Dashboard.jsx";
import Calendar from "views/Calendar/Calendar.jsx";
import Events from "views/Events/Events.jsx";


// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import Accessibility from "@material-ui/icons/Accessibility";
import CardTravel from "@material-ui/icons/CardTravel";
import Assignment from "@material-ui/icons/Assignment";
import Contacts from "@material-ui/icons/Contacts";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Prehľad",
    icon: DashboardIcon,
    component: Dashboard
  },
  {
    path: "/events",
    name: "Eventy",
    state: "openEvents",
    icon: CardTravel,
    component: Events
  },
  {
    path: "/activity-points",
    name: "Aktivity body",
    state: "openActivityPoints",
    icon: Accessibility,
    component: Calendar
  },
  {
    path: "/payments",
    name: "Štúdijné poplatky",
    state: "openPayments",
    icon: Assignment,
    component: Calendar
  },
  {
    path: "/contacts",
    name: "Kontakty",
    state: "openContacts",
    icon: Contacts,
    component: Calendar
  },
];
export default dashRoutes;
