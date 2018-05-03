import React from "react";

// material-ui components
import withStyles from "material-ui/styles/withStyles";
import FormLabel from "material-ui/Form/FormLabel";
import FormControlLabel from "material-ui/Form/FormControlLabel";
import Radio from "material-ui/Radio";
import Checkbox from "material-ui/Checkbox";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import Check from "@material-ui/icons/Check";
import Contacts from "@material-ui/icons/Contacts";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import HeaderCard from "components/Cards/HeaderCard.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

class RegularForms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [24, 22],
      selectedValue: null,
      selectedEnabled: "b"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
  }
  handleChange(event) {
    this.setState({ selectedValue: event.target.value });
  }
  handleChangeEnabled(event) {
    this.setState({ selectedEnabled: event.target.value });
  }
  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <ItemGrid xs={12} sm={12} md={6}>
          <IconCard
            icon={MailOutline}
            iconColor="rose"
            title="Stacked Form"
            content={
              <form>
                <CustomInput
                  labelText="Email adress"
                  id="email_adress"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "email"
                  }}
                />
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "password"
                  }}
                />
                <div className={classes.checkboxAndRadio}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => this.handleToggle(2)}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked
                        }}
                      />
                    }
                    classes={{
                      label: classes.label
                    }}
                    label="Subscribe to newsletter"
                  />
                </div>
                <Button color="rose">Submit</Button>
              </form>
            }
          />
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={6}>
          <IconCard
            icon={Contacts}
            iconColor="rose"
            title="Horizontal Form"
            content={
              <form>
                <GridContainer>
                  <ItemGrid xs={12} sm={12} md={3}>
                    <FormLabel className={classes.labelHorizontal}>
                      Email
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={12} md={9}>
                    <CustomInput
                      id="email_adress2"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email"
                      }}
                    />
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={12} md={3}>
                    <FormLabel className={classes.labelHorizontal}>
                      Password
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={12} md={9}>
                    <CustomInput
                      id="password2"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password"
                      }}
                    />
                  </ItemGrid>
                </GridContainer>
                <GridContainer justify="flex-end">
                  <ItemGrid xs={12} sm={12} md={9}>
                    <div className={classes.checkboxAndRadio}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => this.handleToggle(1)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="Remember me"
                      />
                    </div>
                  </ItemGrid>
                </GridContainer>
                <GridContainer justify="flex-end">
                  <ItemGrid xs={12} sm={12} md={9}>
                    <Button color="rose">Submit</Button>
                  </ItemGrid>
                </GridContainer>
              </form>
            }
          />
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={12}>
          <HeaderCard
            cardTitle="Form Elements"
            headerColor="rose"
            content={
              <form>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      With Help
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <CustomInput
                      id="help-text"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text"
                      }}
                      helpText="A block of help text that breaks onto a new line."
                    />
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Password
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <CustomInput
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password"
                      }}
                    />
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Placeholder
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <CustomInput
                      id="placeholder"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        placeholder: "placeholder"
                      }}
                    />
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Disabled
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <CustomInput
                      id="disabled"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        placeholder: "Disabled",
                        disabled: true
                      }}
                    />
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Static control
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <div className={classes.staticFormGroup}>
                      <p className={classes.staticFormControl}>
                        hello@creative-tim.com
                      </p>
                    </div>
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal + " " + classes.labelHorizontalRadioCheckbox}>
                      Checkboxes and radios
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => this.handleToggle(3)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="First Checkbox"
                      />
                    </div>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => this.handleToggle(4)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="Second Checkbox"
                      />
                    </div>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={this.state.selectedValue === "a"}
                            onChange={this.handleChange}
                            value="a"
                            name="radio button demo"
                            aria-label="A"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="First Radio"
                      />
                    </div>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={this.state.selectedValue === "b"}
                            onChange={this.handleChange}
                            value="b"
                            name="radio button demo"
                            aria-label="B"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="Second Radio"
                      />
                    </div>
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal + " " + classes.labelHorizontalRadioCheckbox}>
                      Inline checkboxes
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <div className={classes.inlineChecks}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => this.handleToggle(10)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="a"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => this.handleToggle(11)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="b"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => this.handleToggle(12)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="c"
                      />
                    </div>
                  </ItemGrid>
                </GridContainer>
              </form>
            }
          />
        </ItemGrid>
        <ItemGrid xs={12} sm={12} md={12}>
          <HeaderCard
            cardTitle="Input Variants"
            content={
              <form>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal + " " + classes.labelHorizontalRadioCheckbox}>
                      Custom Checkboxes & Radios
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={4}>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => this.handleToggle(21)}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="Unchecked"
                      />
                    </div>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => this.handleToggle(22)}
                            checked={
                              this.state.checked.indexOf(22) !== -1
                                ? true
                                : false
                            }
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="Checked"
                      />
                    </div>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            tabIndex={-1}
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked
                            }}
                          />
                        }
                        classes={{
                          label: classes.label,
                          disabled: classes.disabledCheckboxAndRadio
                        }}
                        label="Disabled Unchecked"
                      />
                    </div>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            tabIndex={-1}
                            checked={
                              this.state.checked.indexOf(24) !== -1
                                ? true
                                : false
                            }
                            checkedIcon={
                              <Check className={classes.checkedIcon} />
                            }
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked
                            }}
                          />
                        }
                        classes={{
                          label: classes.label,
                          disabled: classes.disabledCheckboxAndRadio
                        }}
                        label="Disabled Checked"
                      />
                    </div>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={4}>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={this.state.selectedEnabled === "a"}
                            onChange={this.handleChangeEnabled}
                            value="a"
                            name="radio button enabled"
                            aria-label="A"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="First Radio"
                      />
                    </div>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={this.state.selectedEnabled === "b"}
                            onChange={this.handleChangeEnabled}
                            value="b"
                            name="radio button enabled"
                            aria-label="B"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="Second Radio"
                      />
                    </div>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        disabled
                        control={
                          <Radio
                            checked={false}
                            value="a"
                            name="radio button disabled"
                            aria-label="B"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio,
                              disabled: classes.disabledCheckboxAndRadio
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="Second Radio"
                      />
                    </div>
                    <div
                      className={
                        classes.checkboxAndRadio +
                        " " +
                        classes.checkboxAndRadioHorizontal
                      }
                    >
                      <FormControlLabel
                        disabled
                        control={
                          <Radio
                            checked={true}
                            value="b"
                            name="radio button disabled"
                            aria-label="B"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio,
                              disabled: classes.disabledCheckboxAndRadio
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="Second Radio"
                      />
                    </div>
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Input with success
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <CustomInput
                      id="success"
                      labelText="Success"
                      formControlProps={{
                        fullWidth: true
                      }}
                      success
                    />
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Input with error
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <CustomInput
                      id="error"
                      labelText="Error"
                      formControlProps={{
                        fullWidth: true
                      }}
                      error
                    />
                  </ItemGrid>
                </GridContainer>
                <GridContainer>
                  <ItemGrid xs={12} sm={2}>
                    <FormLabel className={classes.labelHorizontal}>
                      Column sizing
                    </FormLabel>
                  </ItemGrid>
                  <ItemGrid xs={12} sm={10}>
                    <GridContainer>
                      <ItemGrid xs={12} sm={12} md={3}>
                        <CustomInput
                          id="md3"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            placeholder: "md={3}"
                          }}
                        />
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={4}>
                        <CustomInput
                          id="md4"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            placeholder: "md={4}"
                          }}
                        />
                      </ItemGrid>
                      <ItemGrid xs={12} sm={12} md={5}>
                        <CustomInput
                          id="md5"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            placeholder: "md={5}"
                          }}
                        />
                      </ItemGrid>
                    </GridContainer>
                  </ItemGrid>
                </GridContainer>
              </form>
            }
          />
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default withStyles(regularFormsStyle)(RegularForms);
