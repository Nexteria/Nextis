import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import withStyles from 'material-ui/styles/withStyles';

import Check from '@material-ui/icons/Check';

import regularFormsStyle from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle';

export class MultiChoice extends React.Component {
  render() {
    const {
      question,
      answer,
      onChange,
      classes,
    } = this.props;

    const selectedNumber = question.choices.filter(choice => choice.selected).size;

    return (
      <div className="col-md-12">
        {question.required && question.minSelection > 1
          ? (
            <div>
              Označte minimálne
              {question.minSelection}
              možností
            </div>
          ) : null
        }

        {[...question.choices].sort((a, b) => a.order - b.order).map(choice => (
          <div key={choice.id}>
            <FormControlLabel
              control={(
                <Checkbox
                  tabIndex={-1}
                  onClick={(e) => {
                    if (e.target.checked) {
                      onChange({
                        ...answer,
                        [e.target.value]: true
                      });
                    } else {
                      delete answer[e.target.value];
                      onChange(answer);
                    }
                  }}
                  checkedIcon={
                    <Check className={classes.checkedIcon} />
                  }
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked
                  }}
                  value={choice.id || ''}
                  disabled={!choice.selected && question.maxSelection && selectedNumber >= question.maxSelection}
                  checked={answer ? answer[choice.id] : false}
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

export default withStyles(regularFormsStyle)(MultiChoice);
