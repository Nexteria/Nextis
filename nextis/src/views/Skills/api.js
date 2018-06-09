import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const getSkillsQuery = gql`
  query SkillsQuery {
    skills {
      id
      name
    }
  }
`;

const createSkillMutation = gql`
  mutation CreateSkill($name: String!) {
    CreateSkill(name: $name) {
      id
      name
    }
  }
`;

export const addCreateSkillMutation = Component =>
  graphql(createSkillMutation, { name: 'createSkill' })(Component);

export const addAllSkillsData = Component =>
  graphql(getSkillsQuery, {
    name: 'allSkillsData',
    options: () => ({ notifyOnNetworkStatusChange: true })
  })(Component);
