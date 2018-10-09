import React from 'react';

import { compose } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Spinner from 'react-spinkit';

// core components
import ItemGrid from 'components/Grid/ItemGrid';
import BasicDetails from 'views/Admin/Events/BasicDetails';
import GridContainer from 'components/Grid/GridContainer';
import HeaderCard from 'components/Cards/HeaderCard';
import Lectors from 'views/Admin/Events/Lectors'

const styles = {};

class EventDetails extends React.Component {
  render() {
    const { classes, data } = this.props;

    if (data.loading) {
      return <Spinner name="line-scale-pulse-out" />;
    }

    const { event } = data;

    return (
      <GridContainer container>
        <ItemGrid xs={12}>
          <HeaderCard
            headerColor="orange"
            cardTitle={event.name}
            content={
              <BasicDetails event={event} />
            }
          />
        </ItemGrid>
        <ItemGrid xs={12}>
          <Lectors lectors={event.lectors} event={event} />
        </ItemGrid>
      </GridContainer>
    );
  }
}

const eventQuery = gql`
query FetchAdminEvent ($id: Int){
  event (id: $id){
    id
    name
    status
    eventType
    shortDescription
    description
    activityPoints
    semester {
      id
      name
    }
    curriculumLevel {
      id
      name
    }
    lectors {
      id
      firstName
      lastName
      profilePicture {
        id
        filePath
      }
    }
  }
}
`;

export default compose(
  withRouter,
  withStyles(styles),
  graphql(eventQuery, {
    options: (props) => {
      const { match } = props;
      const { eventId } = match.params;

      return {
        notifyOnNetworkStatusChange: true,
        variables: {
          id: eventId,
        },
      };
    }
  }),
)(EventDetails);
