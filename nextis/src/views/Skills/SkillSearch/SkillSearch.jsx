import React from 'react';
import { compose, withState } from 'recompose';
import { Route } from 'react-router-dom';

import { DumbSkillSelectWrapper } from 'views/Skills/SkillSelect/SkillSelectWrapper';
import SkillSearchResults from './SkillSearchResults';
import UserInfoModal from 'views/Contacts/UserInfoModal.jsx';

const SkillSearch = ({ selectedSkills, ...rest }) => {
  const selectedSkillIds = selectedSkills.map(t => t.id);
  return [
    <h3 key={0}>Skills selection</h3>,
    <DumbSkillSelectWrapper
      key={1}
      selected={selectedSkills}
      setSelected={rest.setSelectedSkills}
    />,
    <h3 key={2}>Matched people</h3>,
    <SkillSearchResults key={3} skillsToMatch={selectedSkillIds} />,
    <Route key={4} exact path={'/skills/users/:userId'} component={UserInfoModal} />
  ];
};

export default compose(withState('selectedSkills', 'setSelectedSkills', []))(
  SkillSearch
);
