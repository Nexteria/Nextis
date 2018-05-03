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
import Divider from "material-ui/Divider";

// core components
import Button from "components/CustomButtons/Button.jsx";

import customDropdownStyle from "assets/jss/material-dashboard-pro-react/components/customDropdownStyle";

class CustomDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClick() {
    this.setState({ open: true });
  }
  handleClose() {
    this.setState({ open: false });
  }
  render() {
    const { open } = this.state;
    const {
      classes,
      buttonColor,
      buttonText,
      buttonIcon,
      dropdownList,
      buttonProps,
      dropup,
      dropdownHeader,
      rtlActive
    } = this.props;
    const caretClasses =
      classes.caret +
      " " +
      classNames({
        [classes.caretActive]: open,
        [classes.caretRTL]: rtlActive
      });
    const dropdownItem =
      classes.dropdownItem +
      " " +
      classNames({
        [classes.dropdownItemRTL]: rtlActive
      });
    return (
      <Manager style={{ display: "inline-block" }}>
        <Target>
          <Button
            color={buttonColor}
            aria-label="Notifications"
            aria-owns={open ? "menu-list" : null}
            aria-haspopup="true"
            {...buttonProps}
            onClick={this.handleClick}
          >
            {buttonIcon !== undefined ? (
              <this.props.buttonIcon className={classes.buttonIcon} />
            ) : null}
            {buttonText !== undefined ? buttonText : null}
            <b className={caretClasses} />
          </Button>
        </Target>
        <Popper
          placement={dropup ? "top-start" : "bottom-start"}
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
              style={
                dropup
                  ? { transformOrigin: "0 100% 0" }
                  : { transformOrigin: "0 0 0" }
              }
            >
              <Paper className={classes.dropdown}>
                <MenuList role="menu" className={classes.menuList}>
                  {dropdownHeader !== undefined ? (
                    <MenuItem
                      onClick={this.handleClose}
                      className={classes.dropdownHeader}
                    >
                      {dropdownHeader}
                    </MenuItem>
                  ) : null}
                  {dropdownList.map((prop, key) => {
                    if (prop.divider) {
                      return (
                        <Divider
                          key={key}
                          onClick={this.handleClose}
                          className={classes.dropdownDividerItem}
                        />
                      );
                    }
                    return (
                      <MenuItem
                        key={key}
                        onClick={this.handleClose}
                        className={dropdownItem}
                      >
                        {prop}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Paper>
            </Grow>
          </ClickAwayListener>
        </Popper>
      </Manager>
    );
  }
}

CustomDropdown.propTypes = {
  classes: PropTypes.object.isRequired,
  buttonColor: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose",
    "defaultNoBackground",
    "primaryNoBackground",
    "infoNoBackground",
    "successNoBackground",
    "warningNoBackground",
    "dangerNoBackground",
    "roseNoBackground",
    "white",
    "simple",
    "transparent"
  ]),
  buttonText: PropTypes.node,
  buttonIcon: PropTypes.func,
  dropdownList: PropTypes.array,
  buttonProps: PropTypes.object,
  dropup: PropTypes.bool,
  dropdownHeader: PropTypes.node,
  rtlActive: PropTypes.bool
};

export default withStyles(customDropdownStyle)(CustomDropdown);
