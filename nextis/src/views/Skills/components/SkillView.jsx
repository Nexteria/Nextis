import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Skill from './Skill';

const styles = theme => ({
  container: {
    backgroundColor: 'transparent',
    display: 'inline-block',
    textAlign: 'center',
    width: '100%'
  }
});

const SkillView = ({ classes, skills, skillsToMatch, onRemoveItem }) => (
  <div className={classes.container}>
    {!!skills.length
      ? skills.map(skill => (
          <Skill
            skill={skill}
            key={skill.name}
            onRemoveItem={onRemoveItem}
            isMatching={skillsToMatch && skillsToMatch.includes(skill.id)}
          />
        ))
      : 'No skills.'}
  </div>
);

export default withStyles(styles)(SkillView);
