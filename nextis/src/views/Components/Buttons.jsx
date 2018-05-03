import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "material-ui/styles/withStyles";

// @material-ui/icons
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import PriorityHigh from "@material-ui/icons/PriorityHigh";
import Check from "@material-ui/icons/Check";
import Warning from "@material-ui/icons/Warning";
import Close from "@material-ui/icons/Close";
import Favorite from "@material-ui/icons/Favorite";

// core components
import RegularCard from "components/Cards/RegularCard.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import Pagination from "components/Pagination/Pagination.jsx";
import IconButton from "components/CustomButtons/IconButton.jsx";
import Button from "components/CustomButtons/Button.jsx";

import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";

class Buttons extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <RegularCard
        content={
          <div>
            <GridContainer>
              <ItemGrid xs={12} sm={12} md={6}>
                <div className={classes.cardHeader}>
                  <h4 className={classes.cardTitle}>Pick your Color</h4>
                </div>
                <div className={classes.cardContentLeft}>
                  <Button customClass={classes.marginRight}>Default</Button>
                  <Button color="primary" customClass={classes.marginRight}>
                    Primary
                  </Button>
                  <Button color="info" customClass={classes.marginRight}>
                    Info
                  </Button>
                  <Button color="success" customClass={classes.marginRight}>
                    Success
                  </Button>
                  <Button color="warning" customClass={classes.marginRight}>
                    Warning
                  </Button>
                  <Button color="danger" customClass={classes.marginRight}>
                    Danger
                  </Button>
                  <Button color="rose" customClass={classes.marginRight}>
                    Rose
                  </Button>
                </div>
              </ItemGrid>
              <ItemGrid xs={12} sm={12} md={6}>
                <div className={classes.cardHeader}>
                  <h4 className={classes.cardTitle}>Buttons with Label</h4>
                </div>
                <div className={classes.cardContentRight}>
                  <Button customClass={classes.marginRight}>
                    <KeyboardArrowLeft className={classes.icons} /> Left
                  </Button>
                  <Button customClass={classes.marginRight}>
                    Right <KeyboardArrowRight className={classes.icons} />
                  </Button>
                  <Button color="info" customClass={classes.marginRight}>
                    <PriorityHigh className={classes.icons} /> Info
                  </Button>
                  <Button color="success" customClass={classes.marginRight}>
                    <Check className={classes.icons} /> Success
                  </Button>
                  <Button color="warning" customClass={classes.marginRight}>
                    <Warning className={classes.icons} /> Warning
                  </Button>
                  <Button color="danger" customClass={classes.marginRight}>
                    <Close className={classes.icons} /> Danger
                  </Button>
                </div>
              </ItemGrid>
            </GridContainer>
            <GridContainer>
              <ItemGrid xs={12} sm={12} md={6}>
                <div className={classes.cardHeader}>
                  <h4 className={classes.cardTitle}>Pick your Size</h4>
                </div>
                <div className={classes.cardContentLeft}>
                  <Button
                    color="primary"
                    size="xs"
                    customClass={classes.marginRight}
                  >
                    x-Small
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    customClass={classes.marginRight}
                  >
                    Small
                  </Button>
                  <Button color="primary" customClass={classes.marginRight}>
                    Regular
                  </Button>
                  <Button
                    color="primary"
                    size="lg"
                    customClass={classes.marginRight}
                  >
                    Large
                  </Button>
                </div>
              </ItemGrid>
              <ItemGrid xs={12} sm={12} md={6}>
                <div className={classes.cardHeader}>
                  <h4 className={classes.cardTitle}>Pick your Style</h4>
                </div>
                <div className={classes.cardContentRight}>
                  <Button color="primary" customClass={classes.marginRight}>
                    Default
                  </Button>
                  <Button
                    color="primary"
                    round
                    customClass={classes.marginRight}
                  >
                    round
                  </Button>
                  <Button
                    color="primary"
                    round
                    customClass={classes.marginRight}
                  >
                    <Favorite className={classes.icons} /> with icon
                  </Button>
                  <IconButton color="primary" customClass={classes.marginRight}>
                    <Favorite className={classes.icons} />
                  </IconButton>
                  <Button
                    color="primaryNoBackground"
                    customClass={classes.marginRight}
                  >
                    simple
                  </Button>
                </div>
              </ItemGrid>
            </GridContainer>
            <GridContainer>
              <ItemGrid xs={12} sm={12} md={6}>
                <div className={classes.cardHeader}>
                  <h4 className={classes.cardTitle}>Pagination</h4>
                </div>
                <div className={classes.cardContentLeft}>
                  <Pagination
                    pages={[
                      { text: 1 },
                      { text: "..." },
                      { text: 5 },
                      { text: 6 },
                      { active: true, text: 7 },
                      { text: 8 },
                      { text: 9 },
                      { text: "..." },
                      { text: 12 }
                    ]}
                  />
                  <Pagination
                    pages={[
                      { text: "PREV" },
                      { text: 1 },
                      { text: 2 },
                      { active: true, text: 3 },
                      { text: 4 },
                      { text: 5 },
                      { text: "NEXT" }
                    ]}
                    color="info"
                  />
                </div>
              </ItemGrid>
              <ItemGrid xs={12} sm={12} md={6}>
                <div className={classes.cardHeader}>
                  <h4 className={classes.cardTitle}>Button Group</h4>
                </div>
                <div className={classes.cardContentRight}>
                  <div className={classes.buttonGroup}>
                    <Button color="info" customClass={classes.firstButton}>
                      Left
                    </Button>
                    <Button color="info" customClass={classes.middleButton}>
                      Middle
                    </Button>
                    <Button color="info" customClass={classes.lastButton}>
                      Right
                    </Button>
                  </div>
                  <br />
                  <br />
                  <div className={classes.buttonGroup}>
                    <Button
                      color="info"
                      round
                      customClass={classes.firstButton}
                    >
                      1
                    </Button>
                    <Button
                      color="info"
                      round
                      customClass={classes.middleButton}
                    >
                      2
                    </Button>
                    <Button
                      color="info"
                      round
                      customClass={classes.middleButton}
                    >
                      3
                    </Button>
                    <Button color="info" round customClass={classes.lastButton}>
                      4
                    </Button>
                  </div>
                  {` `}
                  <div className={classes.buttonGroup}>
                    <Button
                      color="info"
                      round
                      customClass={classes.firstButton}
                    >
                      5
                    </Button>
                    <Button
                      color="info"
                      round
                      customClass={classes.middleButton}
                    >
                      6
                    </Button>
                    <Button color="info" round customClass={classes.lastButton}>
                      7
                    </Button>
                  </div>
                </div>
              </ItemGrid>
            </GridContainer>
            <GridContainer>
              <ItemGrid xs={12}>
                <div className={classes.cardHeader}>
                  <h4 className={classes.cardTitle}>Social buttons</h4>
                </div>
                <div className={classes.cardContentBottom}>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="twitter">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-twitter"
                          }
                        />{" "}
                        Connect with Twitter
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="twitter">
                        <i className={"fab fa-twitter"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="twitter">
                        <i
                          className={
                            classes.socialButtonsIcons + " fab fa-twitter"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="twitterNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-twitter"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="twitterNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-twitter"
                          }
                        />{" "}
                        Connect with Twitter
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="facebook">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-facebook-square"
                          }
                        />{" "}
                        Share · 2.2k
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="facebook">
                        <i className={"fab fa-facebook"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="facebook">
                        <i
                          className={
                            classes.socialButtonsIcons + " fab fa-facebook"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="facebookNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-facebook-square"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="facebookNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-facebook-square"
                          }
                        />{" "}
                        Share · 2.2k
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="google">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-google-plus-g"
                          }
                        />{" "}
                        Share on Google+
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="google">
                        <i className={"fab fa-google"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="google">
                        <i
                          className={
                            classes.socialButtonsIcons + " fab fa-google"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="googleNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-google"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="googleNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-google-plus-g"
                          }
                        />{" "}
                        Share on Google+
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="linkedin">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-linkedin"
                          }
                        />{" "}
                        Connect with Linkedin
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="linkedin">
                        <i className={"fab fa-linkedin"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="linkedin">
                        <i
                          className={
                            classes.socialButtonsIcons + " fab fa-linkedin"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="linkedinNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-linkedin"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="linkedinNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-linkedin"
                          }
                        />{" "}
                        Connect with Linkedin
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="pinterest">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-pinterest"
                          }
                        />{" "}
                        Pint it · 212
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="pinterest">
                        <i className={"fab fa-pinterest"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="pinterest">
                        <i
                          className={
                            classes.socialButtonsIcons + " fab fa-pinterest"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="pinterestNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-pinterest"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="pinterestNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-pinterest"
                          }
                        />{" "}
                        Pint it · 212
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="youtube">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-youtube"
                          }
                        />{" "}
                        View on Youtube
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="youtube">
                        <i className={"fab fa-youtube-square"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="youtube">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " fab fa-youtube-square"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="youtubeNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-youtube-square"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="youtubeNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-youtube"
                          }
                        />{" "}
                        View on Youtube
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="tumblr">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-tumblr-square"
                          }
                        />{" "}
                        Repost
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="tumblr">
                        <i className={"fab fa-tumblr-square"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="tumblr">
                        <i
                          className={
                            classes.socialButtonsIcons + " fab fa-tumblr-square"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="tumblrNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-tumblr-square"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="tumblrNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-tumblr-square"
                          }
                        />{" "}
                        Repost
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="github">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-github"
                          }
                        />{" "}
                        Connect with Github
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="github">
                        <i className={"fab fa-github"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="github">
                        <i
                          className={
                            classes.socialButtonsIcons + " fab fa-github"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="githubNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-github"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="githubNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-github"
                          }
                        />{" "}
                        Connect with Github
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="behance">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-behance-square"
                          }
                        />{" "}
                        Follow us
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="behance">
                        <i className={"fab fa-behance"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="behance">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " fab fa-behance-square"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="behanceNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-behance"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="behanceNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-behance-square"
                          }
                        />{" "}
                        Follow us
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="dribbble">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-dribbble"
                          }
                        />{" "}
                        Find us on Dribble
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="dribbble">
                        <i className={"fab fa-dribbble"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="dribbble">
                        <i
                          className={
                            classes.socialButtonsIcons + " fab fa-dribbble"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="dribbbleNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-dribbble"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="dribbbleNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-dribbble"
                          }
                        />{" "}
                        Find us on Dribble
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <Button color="reddit">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-reddit"
                          }
                        />{" "}
                        Repost · 232
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="reddit">
                        <i className={"fab fa-reddit"} />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon round color="reddit">
                        <i
                          className={
                            classes.socialButtonsIcons + " fab fa-reddit"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={1} md={1}>
                      <Button justIcon color="redditNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-reddit"
                          }
                        />
                      </Button>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <Button color="redditNoBackground">
                        <i
                          className={
                            classes.socialButtonsIcons +
                            " " +
                            classes.marginRight +
                            " fab fa-reddit"
                          }
                        />{" "}
                        Repost · 232
                      </Button>
                    </ItemGrid>
                  </GridContainer>
                </div>
              </ItemGrid>
            </GridContainer>
          </div>
        }
      />
    );
  }
}

Buttons.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(buttonsStyle)(Buttons);
