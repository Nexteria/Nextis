import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Spinner from 'react-spinkit';
import GridContainer from 'components/Grid/GridContainer.jsx';

import UserSkillCard from 'views/Skills/components/UserSkillCard';
import NoResults from './NoResults';

const SkillSearchResults = ({
  data: { users, loading },
  skillsToMatch
}) =>
  loading ? (
    <Spinner name="line-scale-pulse-out" />
  ) : users && users.length ? (
    <GridContainer style={{ marginTop: '35px' }}>
      {users.map(user => (
        <UserSkillCard
          key={user.id}
          userId={user.id}
          skillsToMatch={skillsToMatch}
        />
      ))}
    </GridContainer>
  ) : (
    <NoResults />
  );

const getUsersWithSimilarSkillsQuery = gql`
  query UsersSkillsQuery($skill_ids: [Int!]) {
    users(skill_ids: $skill_ids) {
      id
    }
  }
`;

export default graphql(getUsersWithSimilarSkillsQuery, {
  options: ({ skillsToMatch }) => ({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    variables: {
      skill_ids: skillsToMatch
    }
  })
})(SkillSearchResults);
