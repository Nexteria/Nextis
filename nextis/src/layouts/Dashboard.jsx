import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import { compose } from 'recompose';
import { connect } from "common/store";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Spinner from 'react-spinkit';

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import dashboardRoutes from "routes/dashboard.jsx";

import appStyle from "assets/jss/material-dashboard-pro-react/layouts/dashboardStyle.jsx";

import image from "assets/img/sidebar-2.jpg";
import Logo from "assets/img/nexteria_logo.png";

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
      if (prop.collapse)
        return prop.views.map((prop, key) => {
          return (
            <Route path={prop.path} component={prop.component} key={key} />
          );
        });
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.updateRoutes = this.updateRoutes.bind(this);
  }

  state = {
    mobileOpen: false,
    miniActive: false
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps/full-screen-maps";
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      // eslint-disable-next-line
      ps = new PerfectScrollbar(this.refs.mainPanel, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname && this.refs.mainPanel) {
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  sidebarMinimize() {
    this.setState({ miniActive: !this.state.miniActive });
  }

  updateRoutes(routes) {
    return routes.map(route => {
      if (route.baseLink && route.baseLink === '/activity-points' && this.props.student) {
        route.baseLink = `/activity-points/${this.props.student.activeSemesterId}`;
        return route;
      }

      return route;
    });
  }

  render() {
    const { classes, history, data, ...rest } = this.props;

    if (data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const mainPanel =
      classes.mainPanel +
      " " +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
        [classes.mainPanelWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });

    let sidebarRoutes = this.updateRoutes(dashboardRoutes);

    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={sidebarRoutes}
          logoText={"Space"}
          logo={Logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="orange"
          bgColor="black"
          miniActive={this.state.miniActive}
          location={this.props.location}
          {...rest}
          user={data.user}
        />
        <div className={mainPanel} ref="mainPanel">
          <Header
            sidebarMinimize={this.sidebarMinimize.bind(this)}
            miniActive={this.state.miniActive}
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            history={history}
            {...rest}
          />
          {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
          {this.getRoute() ? <Footer fluid /> : null}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

const userQuery = gql`
query FetchUser ($id: Int){
  user (id: $id){
    id
    firstName
    lastName
    profilePicture {
      id
      filePath
    }
  }
}
`;


export default compose(
  withRouter,
  connect(state => ({ user: state.user, student: state.student })),
  withStyles(appStyle),
  graphql(userQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.user.id,
      },
    })
  }),
)(Dashboard);


