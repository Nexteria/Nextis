import React from 'react';
import { compose, withState, withHandlers } from 'recompose';

import SkillSelect from './SkillSelect';
import { addAllSkillsData } from 'views/Skills/api';

const SkillSelectWrapper = ({
  allSkillsData: { skills },
  selected,
  selectSkill,
  removeSkill,
  isAdding = false
}) => {
  if (!skills) return null;

  const selectedIds = selected.map(t => t.id);
  return (
    <SkillSelect
      allItems={skills}
      availableItems={skills.filter(t => !selectedIds.includes(t.id))}
      selectedItem={selected}
      onChange={selectSkill}
      onRemoveItem={removeSkill}
      isAdding={isAdding}
    />
  );
};

const addSelectedHandlers = Component =>
  compose(
    withHandlers({
      selectSkill: ({ setSelected }) => item => {
        setSelected(skills => {
          const duplicates = skills.filter(skill => skill.id === item.id);
          return duplicates.length ? skills : [...skills, item];
        })
      },
      removeSkill: ({ setSelected }) => item =>
        setSelected(skills =>
          skills.filter(t => t.id !== item.id || t.name !== item.name)
        )
    })
  )(Component);

// dumb skill select wrapper does not manage its state, but rather the state passed
export const DumbSkillSelectWrapper = compose(
  addAllSkillsData,
  addSelectedHandlers
)(SkillSelectWrapper);

export default compose(
  addAllSkillsData,
  withState('selected', 'setSelected', []),
  addSelectedHandlers
)(SkillSelectWrapper);
