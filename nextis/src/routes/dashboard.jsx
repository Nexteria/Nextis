import Dashboard from "views/Dashboard/Dashboard.jsx";
import Events from "views/Events/Events.jsx";
import Contacts from "views/Contacts/Contacts.jsx";
import ActivityPoints from "views/ActivityPoints/ActivityPoints.jsx";
import Payments from "views/Payments/Payments.jsx";
import Profile from "views/Profile/Profile.jsx";


// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import Accessibility from "@material-ui/icons/Accessibility";
import CardTravel from "@material-ui/icons/CardTravel";
import Assignment from "@material-ui/icons/Assignment";
import ContactsIcon from "@material-ui/icons/Contacts";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Prehľad",
    icon: DashboardIcon,
    component: Dashboard,
    showInMenu: true,
  },
  {
    path: "/my-profile",
    name: "Môj profil",
    component: Profile,
    showInMenu: false,
  },
  {
    path: "/events",
    name: "Eventy",
    state: "openEvents",
    icon: CardTravel,
    component: Events,
    showInMenu: true,
  },
  {
    path: "/activity-points/:semesterId?",
    baseLink: "/activity-points",
    name: "Aktivity body",
    state: "openActivityPoints",
    icon: Accessibility,
    component: ActivityPoints,
    showInMenu: true,
  },
  {
    path: "/payments",
    name: "Členské",
    state: "openPayments",
    icon: Assignment,
    component: Payments,
    showInMenu: true,
  },
  {
    path: "/contacts",
    name: "Kontakty",
    state: "openContacts",
    icon: ContactsIcon,
    component: Contacts,
    showInMenu: true,
  },
];
export default dashRoutes;
