import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import request from "common/fetch";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import IconButton from "material-ui/IconButton";
import Hidden from "material-ui/Hidden";

// @material-ui/icons
import PowerIcon from '@material-ui/icons/PowerSettingsNew';


import headerLinksStyle from "assets/jss/material-dashboard-pro-react/components/headerLinksStyle";

class HeaderLinks extends React.Component {
  state = {
    open: false
  };
  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleLogout = () => {
    request('/logout', {method: 'post', credentials: 'same-origin',}).then(() => this.props.history.push('/login'));
  }

  render() {
    const { classes, rtlActive } = this.props;

    const wrapper = classNames({
      [classes.wrapperRTL]: rtlActive
    });

    return (
      <div className={wrapper}>
        <IconButton
          color="inherit"
          aria-label="Person"
          className={rtlActive ? classes.buttonLinkRTL:classes.buttonLink}
          classes={{
            label: rtlActive ? classes.labelRTL:""
          }}
          onClick={this.handleLogout}
        >
          <PowerIcon className={classes.links} />
          <Hidden mdUp>
            <p className={classes.linkText}>
              {"Logout"}
            </p>
          </Hidden>
        </IconButton>
      </div>
    );
  }
}

HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  rtlActive: PropTypes.bool
};

export default withStyles(headerLinksStyle)(HeaderLinks);
