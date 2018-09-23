// ##############################
// // // StatsCard styles
// #############################

import {
  card,
  cardHeader,
  defaultFont,
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  cardActions,
  grayColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  primaryColor,
  roseColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const cardTitleSmall = {
  fontSize: "65%",
  fontWeight: "400",
  lineHeight: "1",
  color: "#777"
};

const cardTitle = {
  margin: "0",
  ...defaultFont,
  fontSize: "1.825em"
};

const statsCardStyle = theme => ({
  card: {
    ...card,
    overflow: 'visible',
  },
  cardHeader: {
    ...cardHeader,
    float: "left",
    textAlign: "center",
    position: 'relative',
  },
  cardHeaderButton: {
    cursor: 'pointer',
  },
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  cardContent: {
    textAlign: "right",
    paddingTop: "10px",
    padding: "15px 20px"
  },
  cardIcon: {
    width: "40px",
    height: "36px",
    fill: "#fff"
  },
  cardAvatar: {
    margin: '10px 8px 10px',
    display: 'flex',
  },
  cardCategory: {
    marginBottom: "0",
    color: grayColor,
    margin: "0 0 10px",
    ...defaultFont
  },
  cardActions: {
    ...cardActions,
    padding: "10px 0 0 0!important"
  },
  cardStats: {
    lineHeight: "22px",
    color: grayColor,
    fontSize: "12px",
    display: "inline-block",
    margin: "0!important"
  },
  cardStatsIcon: {
    position: "relative",
    top: "4px",
    width: "16px",
    height: "16px"
  },
  warningCardTitleSmall: {
    color: warningColor,
    ...cardTitleSmall,
  },
  warningCardTitle: {
    color: warningColor,
    ...cardTitle,
  },
  warningCardStatsIcon: {
    color: warningColor
  },
  primaryCardTitleSmall: {
    color: primaryColor,
    ...cardTitleSmall,
  },
  primaryCardTitle: {
    color: primaryColor,
    ...cardTitle,
  },
  primaryCardStatsIcon: {
    color: primaryColor
  },
  dangerCardTitleSmall: {
    color: dangerColor,
    ...cardTitleSmall,
  },
  dangerCardTitle: {
    color: dangerColor,
    ...cardTitle,
  },
  dangerCardStatsIcon: {
    color: dangerColor
  },
  successCardTitleSmall: {
    color: successColor,
    ...cardTitleSmall,
  },
  successCardTitle: {
    color: successColor,
    ...cardTitle,
  },
  successCardStatsIcon: {
    color: successColor
  },
  infoCardTitleSmall: {
    color: infoColor,
    ...cardTitleSmall,
  },
  infoCardTitle: {
    color: infoColor,
    ...cardTitle,
  },
  infoCardStatsIcon: {
    color: infoColor
  },
  roseCardTitleSmall: {
    color: roseColor,
    ...cardTitleSmall,
  },
  roseCardTitle: {
    color: roseColor,
    ...cardTitle,
  },
  roseCardStatsIcon: {
    color: roseColor
  },
  grayCardTitleSmall: {
    color: grayColor,
    ...cardTitleSmall,
  },
  grayCardTitle: {
    color: grayColor,
    ...cardTitle,
  },
  grayCardStatsIcon: {
    color: grayColor
  },
  cardStatsLink: {
    color: primaryColor,
    textDecoration: "none",
    ...defaultFont
  },
  moveHeaderUp: {
    transform: "translate3d(0, -10px, 0)",
  },
  badgeBottomRight: {
    zIndex: "4",
    position: "absolute",
    bottom: "15px",
    right: "10px",
    display: "block"
  },
  badgeBottomLeft: {
    zIndex: "4",
    position: "absolute",
    bottom: "15px",
    left: "10px",
    verticalAlign: "middle",
    display: "block"
  },
  badgeTopRight: {
    zIndex: "4",
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "block"
  },
  badgeTopLeft: {
    zIndex: "4",
    position: "absolute",
    top: "10px",
    left: "10px",
    display: "block"
  },
});

export default statsCardStyle;
