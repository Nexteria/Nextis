import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// core components
import ProfileCard from "components/Cards/ProfileCard.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import avatar from "assets/img/faces/avatar.jpg";

import lockScreenPageStyle from "assets/jss/material-dashboard-pro-react/views/lockScreenPageStyle.jsx";

class LockScreenPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden"
    };
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.content}>
        <form>
          <ProfileCard
            customCardClass={
              classes.customCardClass + " " + classes[this.state.cardAnimaton]
            }
            customCardAvatarClass={classes.customCardAvatarClass}
            customCardFooterClass={classes.customCardFooterClass}
            title="Tania Andrew"
            avatar={avatar}
            content={
              <CustomInput
                labelText="Enter Password"
                id="company-disabled"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "password"
                }}
              />
            }
            footer={
              <Button color="rose" round>
                Unlock
              </Button>
            }
          />
        </form>
      </div>
    );
  }
}

LockScreenPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(lockScreenPageStyle)(LockScreenPage);
