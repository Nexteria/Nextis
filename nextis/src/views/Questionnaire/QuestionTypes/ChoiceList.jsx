import React from 'react';

import FiberManualRecord from '@material-ui/icons/FiberManualRecord';

import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import withStyles from '@material-ui/core/styles/withStyles';

import regularFormsStyle from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

export class ChoiceList extends React.Component {
  render() {
    const {
      question,
      onChange,
      answer,
      classes,
    } = this.props;

    return (
      <div className="col-md-12">
        {[...question.choices].sort((a, b) => a.order - b.order).map(choice => (
          <div className="radio" key={choice.id}>
            <FormControlLabel
              control={(
                <Radio
                  checked={choice.id === answer}
                  onChange={e => onChange(e.target.value)}
                  name={question.id}
                  value={choice.id}
                  aria-label={choice.title}
                  icon={(
                    <FiberManualRecord
                      className={classes.radioUnchecked}
                    />
                  )}
                  checkedIcon={(
                    <FiberManualRecord
                      className={classes.radioChecked}
                    />
                  )}
                  classes={{
                    checked: classes.radio
                  }}
                />
              )}
              classes={{
                label: classes.label
              }}
              label={choice.title}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default withStyles(regularFormsStyle)(ChoiceList);
