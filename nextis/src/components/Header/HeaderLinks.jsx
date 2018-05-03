import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Manager, Target, Popper } from "react-popper";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import MenuItem from "material-ui/Menu/MenuItem";
import MenuList from "material-ui/Menu/MenuList";
import ClickAwayListener from "material-ui/utils/ClickAwayListener";
import Paper from "material-ui/Paper";
import Grow from "material-ui/transitions/Grow";
import IconButton from "material-ui/IconButton";
import Hidden from "material-ui/Hidden";

// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";

// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import SearchButton from "components/CustomButtons/IconButton.jsx";

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
  render() {
    const { classes, rtlActive } = this.props;
    const { open } = this.state;
    const searchButton =
      classes.top +
      " " +
      classes.searchButton +
      " " +
      classNames({
        [classes.searchRTL]: rtlActive
      });
    const dropdownItem =
      classes.dropdownItem +
      " " +
      classNames({
        [classes.dropdownItemRTL]: rtlActive
      });
    const wrapper = classNames({
      [classes.wrapperRTL]: rtlActive
    });
    const managerClasses = classNames({
      [classes.managerClasses]: true
    });
    return (
      <div className={wrapper}>
        <CustomInput
          rtlActive={rtlActive}
          formControlProps={{
            className: classes.top + " " + classes.search
          }}
          inputProps={{
            placeholder: rtlActive ? "بحث" : "Search",
            inputProps: {
              "aria-label": rtlActive ? "بحث" : "Search",
              className: classes.searchInput
            }
          }}
        />
        <SearchButton
          color="white"
          aria-label="edit"
          customClass={searchButton}
        >
          <Search className={classes.searchIcon} />
        </SearchButton>
        <IconButton
          color="inherit"
          aria-label="Dashboard"
          className={rtlActive ? classes.buttonLinkRTL:classes.buttonLink}
          classes={{
            label: rtlActive ? classes.labelRTL:""
          }}
        >
          <Dashboard className={rtlActive ? classes.links + " " + classes.linksRTL:classes.links} />
          <Hidden mdUp>
            <p className={classes.linkText}>
              {rtlActive ? "لوحة القيادة" : "Dashboard"}
            </p>
          </Hidden>
        </IconButton>
        <Manager className={managerClasses}>
          <Target>
            <IconButton
              color="inherit"
              aria-label="Notifications"
              aria-owns={open ? "menu-list" : null}
              aria-haspopup="true"
              onClick={this.handleClick}
              className={rtlActive ? classes.buttonLinkRTL:classes.buttonLink}
              classes={{
                label: rtlActive ? classes.labelRTL:""
              }}
            >
              <Notifications className={rtlActive ? classes.links + " " + classes.linksRTL:classes.links} />
              <span className={classes.notifications}>5</span>
              <Hidden mdUp>
                <p onClick={this.handleClick} className={classes.linkText}>
                  {rtlActive ? "إعلام" : "Notification"}
                </p>
              </Hidden>
            </IconButton>
          </Target>
          <Popper
            placement="bottom-start"
            eventsEnabled={open}
            className={
              classNames({ [classes.popperClose]: !open }) +
              " " +
              classes.pooperResponsive
            }
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow
                in={open}
                id="menu-list"
                style={{ transformOrigin: "0 0 0" }}
              >
                <Paper className={classes.dropdown}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={this.handleClose}
                      className={dropdownItem}
                    >
                      {rtlActive
                        ? "إجلاء أوزار الأسيوي حين بل, كما"
                        : "Mike John responded to your email"}
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleClose}
                      className={dropdownItem}
                    >
                      {rtlActive
                        ? "شعار إعلان الأرضية قد ذلك"
                        : "You have 5 new tasks"}
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleClose}
                      className={dropdownItem}
                    >
                      {rtlActive
                        ? "ثمّة الخاصّة و على. مع جيما"
                        : "You're now friend with Andrew"}
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleClose}
                      className={dropdownItem}
                    >
                      {rtlActive ? "قد علاقة" : "Another Notification"}
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleClose}
                      className={dropdownItem}
                    >
                      {rtlActive ? "قد فاتّبع" : "Another One"}
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
        <IconButton
          color="inherit"
          aria-label="Person"
          className={rtlActive ? classes.buttonLinkRTL:classes.buttonLink}
          classes={{
            label: rtlActive ? classes.labelRTL:""
          }}
        >
          <Person className={rtlActive ? classes.links + " " + classes.linksRTL:classes.links} />
          <Hidden mdUp>
            <p className={classes.linkText}>
              {rtlActive ? "الملف الشخصي" : "Profile"}
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
