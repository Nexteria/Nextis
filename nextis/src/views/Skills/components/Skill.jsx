import React from 'react';
import classnames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
  skill: {
    marginTop: 10,
    marginRight: 5
  },
  matching: {
    backgroundColor: '#FFEE58'
  }
});

const Skill = ({ classes, skill, onRemoveItem, isMatching = false }) =>
  onRemoveItem ? (
    <Chip
      key={skill.name}
      className={classes.skill}
      label={skill.name}
      deleteIcon={<CancelIcon />}
      onDelete={() => onRemoveItem(skill)}
      onClick={() => onRemoveItem(skill)}
    />
  ) : (
    <Chip
      key={skill.name}
      className={classnames(classes.skill, { [classes.matching]: isMatching })}
      label={skill.name}
    />
  );

export default withStyles(styles)(Skill);
