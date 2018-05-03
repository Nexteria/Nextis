import React from "react";
// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime";
// react component plugin for creating beatiful tags on an input
import TagsInput from "react-tagsinput";
// react plugin that creates slider
import Nouislider from "react-nouislider";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import FormControl from "material-ui/Form/FormControl";
import FormControlLabel from "material-ui/Form/FormControlLabel";
import InputLabel from "material-ui/Input/InputLabel";
import Switch from "material-ui/Switch";
import Select from "material-ui/Select";
import MenuItem from "material-ui/Menu/MenuItem";

// @material-ui/icons
import Today from "@material-ui/icons/Today";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import AvTimer from "@material-ui/icons/AvTimer";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";
import ImageUpload from "components/CustomUpload/ImageUpload.jsx";

import extendedFormsStyle from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx";

class ExtendedForms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedA: true,
      checkedB: false,
      simpleSelect: "",
      multipleSelect: [],
      tags: ["pizza", "pasta", "parmesan"]
    };
    this.handleTags = this.handleTags.bind(this);
  }
  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleMultiple = event => {
    this.setState({ multipleSelect: event.target.value });
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  handleTags(regularTags) {
    this.setState({ tags: regularTags });
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={4}>
            <IconCard
              icon={Today}
              iconColor="rose"
              title="Datetime Picker"
              content={
                <div>
                  <InputLabel className={classes.label}>
                    Datetime Picker
                  </InputLabel>
                  <br />
                  <FormControl fullWidth>
                    <Datetime
                      inputProps={{ placeholder: "Datetime Picker Here" }}
                    />
                  </FormControl>
                </div>
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <IconCard
              icon={LibraryBooks}
              iconColor="rose"
              title="Datetime Picker"
              content={
                <div>
                  <InputLabel className={classes.label}>Date Picker</InputLabel>
                  <br />
                  <FormControl fullWidth>
                    <Datetime
                      timeFormat={false}
                      inputProps={{ placeholder: "Date Picker Here" }}
                    />
                  </FormControl>
                </div>
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <IconCard
              icon={AvTimer}
              iconColor="rose"
              title="Datetime Picker"
              content={
                <div>
                  <InputLabel className={classes.label}>Time Picker</InputLabel>
                  <br />
                  <FormControl fullWidth>
                    <Datetime
                      dateFormat={false}
                      inputProps={{ placeholder: "Time Picker Here" }}
                    />
                  </FormControl>
                </div>
              }
            />
          </ItemGrid>
        </GridContainer>
        <GridContainer>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              content={
                <div>
                  <br />
                  <br />
                  <GridContainer>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <legend>Switches</legend>
                      <div className={classes.block}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={this.state.checkedA}
                              onChange={this.handleChange("checkedA")}
                              value="checkedA"
                              classes={{
                                checked: classes.switchChecked,
                                bar: classes.switchBarChecked,
                                icon: classes.switchIcon,
                                default: classes.switchUnchecked,
                                iconChecked: classes.switchIconChecked
                              }}
                            />
                          }
                          classes={{
                            label: classes.label
                          }}
                          label="Toggle is on"
                        />
                      </div>
                      <div className={classes.block}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={this.state.checkedB}
                              onChange={this.handleChange("checkedB")}
                              value="checkedB"
                              classes={{
                                checked: classes.switchChecked,
                                bar: classes.switchBarChecked,
                                icon: classes.switchIcon,
                                default: classes.switchUnchecked,
                                iconChecked: classes.switchIconChecked
                              }}
                            />
                          }
                          classes={{
                            label: classes.label
                          }}
                          label="Toggle is off"
                        />
                      </div>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <legend>Customisable Select</legend>
                      <GridContainer>
                        <ItemGrid xs={12} sm={6} md={5} lg={5}>
                          <FormControl
                            fullWidth
                            className={classes.selectFormControl}
                          >
                            <InputLabel
                              htmlFor="simple-select"
                              className={classes.selectLabel}
                            >
                              Choose City
                            </InputLabel>
                            <Select
                              MenuProps={{
                                className: classes.selectMenu
                              }}
                              classes={{
                                select: classes.select
                              }}
                              value={this.state.simpleSelect}
                              onChange={this.handleSimple}
                              inputProps={{
                                name: "simpleSelect",
                                id: "simple-select"
                              }}
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem
                                }}
                              >
                                Choose City
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="2"
                              >
                                Paris
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="3"
                              >
                                Bucharest
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="4"
                              >
                                Rome
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="5"
                              >
                                New York
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="6"
                              >
                                Miami
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="7"
                              >
                                Piatra Neamt
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="8"
                              >
                                Paris
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="9"
                              >
                                Bucharest
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="10"
                              >
                                Rome
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="11"
                              >
                                New York
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="12"
                              >
                                Miami
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="13"
                              >
                                Piatra Neamt
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="14"
                              >
                                Paris
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="15"
                              >
                                Bucharest
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="16"
                              >
                                Rome
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="17"
                              >
                                New York
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="18"
                              >
                                Miami
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="19"
                              >
                                Piatra Neamt
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={5} lg={5}>
                          <FormControl
                            fullWidth
                            className={classes.selectFormControl}
                          >
                            <InputLabel
                              htmlFor="multiple-select"
                              className={classes.selectLabel}
                            >
                              Choose City
                            </InputLabel>
                            <Select
                              multiple
                              value={this.state.multipleSelect}
                              onChange={this.handleMultiple}
                              MenuProps={{ className: classes.selectMenu }}
                              classes={{ select: classes.select }}
                              inputProps={{
                                name: "multipleSelect",
                                id: "multiple-select"
                              }}
                            >
                              <MenuItem
                                disabled
                                classes={{
                                  root: classes.selectMenuItem
                                }}
                              >
                                Choose City
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="2"
                              >
                                Paris
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="3"
                              >
                                Bucharest
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="4"
                              >
                                Rome
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="5"
                              >
                                New York
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="6"
                              >
                                Miami
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="7"
                              >
                                Piatra Neamt
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="8"
                              >
                                Paris
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="9"
                              >
                                Bucharest
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="10"
                              >
                                Rome
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="11"
                              >
                                New York
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="12"
                              >
                                Miami
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="13"
                              >
                                Piatra Neamt
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="14"
                              >
                                Paris
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="15"
                              >
                                Bucharest
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="16"
                              >
                                Rome
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="17"
                              >
                                New York
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="18"
                              >
                                Miami
                              </MenuItem>
                              <MenuItem
                                classes={{
                                  root: classes.selectMenuItem,
                                  selected: classes.selectMenuItemSelected
                                }}
                                value="19"
                              >
                                Piatra Neamt
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </ItemGrid>
                      </GridContainer>
                    </ItemGrid>
                  </GridContainer>
                  <br />
                  <br />
                  <GridContainer>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <legend>Tags</legend>
                      <TagsInput
                        value={this.state.tags}
                        onChange={this.handleTags}
                        tagProps={{ className: "react-tagsinput-tag info" }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <legend>Dropdown & Dropup</legend>
                      <GridContainer>
                        <ItemGrid xs={12} sm={6} md={5} lg={4}>
                          <CustomDropdown
                            buttonColor="info"
                            buttonText="Dropdown"
                            buttonProps={{
                              round: true,
                              fullWidth: true,
                              style: { marginBottom: "0" }
                            }}
                            dropdownHeader="Dropdown header"
                            dropdownList={[
                              "Action",
                              "Another action",
                              "Something else here",
                              { divider: true },
                              "Separated link",
                              { divider: true },
                              "One more separated link"
                            ]}
                          />
                        </ItemGrid>
                        <ItemGrid xs={12} sm={6} md={5} lg={4}>
                          <CustomDropdown
                            dropup
                            buttonColor="info"
                            buttonText="Dropup"
                            buttonProps={{
                              round: true,
                              fullWidth: true,
                              style: { marginBottom: "0" }
                            }}
                            dropdownHeader="Dropdown header"
                            dropdownList={[
                              "Action",
                              "Another action",
                              "Something else here",
                              { divider: true },
                              "Separated link",
                              { divider: true },
                              "One more separated link"
                            ]}
                          />
                        </ItemGrid>
                      </GridContainer>
                    </ItemGrid>
                  </GridContainer>
                  <br />
                  <br />
                  <GridContainer>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <legend>Progress Bars</legend>
                      <CustomLinearProgress
                        variant="determinate"
                        color="primary"
                        value={30}
                      />
                      <CustomLinearProgress
                        variant="determinate"
                        color="info"
                        value={60}
                      />
                      <CustomLinearProgress
                        variant="determinate"
                        color="success"
                        value={100}
                        style={{ width: "35%", display: "inline-block" }}
                      />
                      <CustomLinearProgress
                        variant="determinate"
                        color="warning"
                        value={100}
                        style={{ width: "20%", display: "inline-block" }}
                      />
                      <CustomLinearProgress
                        variant="determinate"
                        color="danger"
                        value={25}
                        style={{ width: "45%", display: "inline-block" }}
                      />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={6}>
                      <legend>Sliders</legend>
                      <Nouislider
                        start={[40]}
                        connect={[true, false]}
                        step={1}
                        range={{ min: 0, max: 100 }}
                      />
                      <br />
                      <div className="slider slider-info">
                        <Nouislider
                          start={[20, 60]}
                          connect={[false, true, false]}
                          step={1}
                          range={{ min: 0, max: 100 }}
                        />
                      </div>
                    </ItemGrid>
                  </GridContainer>
                  <GridContainer>
                    <ItemGrid xs={12} sm={4} md={4}>
                      <legend>Regular Image</legend>
                      <ImageUpload />
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4} md={3}>
                      <legend>Avatar</legend>
                      <ImageUpload avatar />
                    </ItemGrid>
                  </GridContainer>
                </div>
              }
            />
          </ItemGrid>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(extendedFormsStyle)(ExtendedForms);
