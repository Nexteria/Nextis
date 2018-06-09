import React from 'react';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from "react-router-dom";
import withStyles from 'material-ui/styles/withStyles';

import Spinner from 'react-spinkit';
import avatarImg from 'assets/img/default-avatar.png';

import ItemGrid from 'components/Grid/ItemGrid.jsx';
import ProfileCard from 'components/Cards/ProfileCard.jsx';

import SkillView from 'views/Skills/components/SkillView';

import profileStyle from 'assets/jss/material-dashboard-pro-react/views/profileStyle.jsx';

const UserSkillCard = ({
  data: { user, loading },
  skillsToMatch,
  classes,
  history,
}) =>
  loading ? (
    <Spinner name="line-scale-pulse-out" />
  ) : user ? (
    <ItemGrid xs={10} sm={8} md={6} lg={4}>
      <ProfileCard
        avatar={
          <img
            src={user.profilePicture ? user.profilePicture.filePath : avatarImg}
            alt={user.lastName}
            className={classes.img}
          />
        }
        customCardClass={classes.skillsProfileCard}
        onClick={() => history.push(`/skills/users/${user.id}`)}
        subtitle={user.actualJobInfo || ''}
        title={`${user.firstName} ${user.lastName}`}
        content={
          <SkillView
            skills={user.skills}
            skillsToMatch={skillsToMatch}
          />
        }
      />
    </ItemGrid>
  ) : null;

const StudentsQuery = gql`
  query FetchUser($userId: Int) {
    user(id: $userId) {
      id
      firstName
      lastName
      email
      phone
      profilePicture {
        id
        filePath
      }
      personalDescription
      facebookLink
      linkedinLink
      actualJobInfo
      school
      studyProgram
      studyYear
      student {
        id
        level {
          id
          name
        }
      }
      skills {
        id
        name
      }
    }
  }
`;

export default compose(
  withRouter,
  withStyles(profileStyle),
  graphql(StudentsQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        userId: props.userId
      }
    })
  }),
)(UserSkillCard);
