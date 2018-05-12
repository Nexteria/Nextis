import React from "react";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import { withRouter, Route } from "react-router-dom";
import Spinner from 'react-spinkit';

// material-ui icons
import Info from "@material-ui/icons/Info";

// core components
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
import InfoDialog from "components/Dialogs/InfoDialog.jsx";


class ActivityPointsListTable extends React.Component {
  constructor(props) {
    super(props);

    this.handleNotesButtonClick = this.handleNotesButtonClick.bind(this);
  }

  handleNotesButtonClick(pointsId) {
    this.props.history.push(`/activity-points/${this.props.semesterId}/points/${pointsId}`);
  }

  render() {
    if (this.props.data.loading) {
      return <Spinner name='line-scale-pulse-out' />;
    }

    const { classes, data, semesterId, history } = this.props;

    const student = data.student;

    return (
      <div>
        <Table
          hover
          tableHeaderColor="warning"
          tableHead={["Názov", "Body", ""]}
          tableData={student.activityPoints.map(points =>
            [
              points.activityName,
              `${points.gainedPoints} / ${points.maxPossiblePoints}`,
              points.note ?
                <Button
                  color="info"
                  customClass={classes.actionButton}
                  onClick={() => this.handleNotesButtonClick(points.id)}
                >
                  <Info className={classes.icon} />
                </Button>
                : ""
              ,
            ]
          )}
        />

        <Route
          path="/activity-points/:semesterId/points/:pointsId"
          exact
          render={props => {
            const pointsId = parseInt(props.match.params.pointsId, 10);
            const points = student.activityPoints.filter(points => points.id === pointsId)[0];

            return (
              <InfoDialog
                title={<h6><b>Poznámka k bodom</b></h6>}
                content={points.note}
                onClose={() => history.push(`/activity-points/${semesterId}`)}
              />
            );
          }}
        />
      </div>
    );
  }
}

const studentQuery = gql`
query FetchStudent ($id: Int, $semesterId: Int){
  student (id: $id) {
    id
    activityPoints (semesterId: $semesterId){
      id
      gainedPoints
      maxPossiblePoints
      activityName
      activityType
      activityModelId
      note
      updated_at
    }
  }
}
`;

export default compose(
  graphql(studentQuery, {
    options: props => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        id: props.studentId,
        semesterId: props.semesterId,
      },
    })
  }),
  withRouter,
)(ActivityPointsListTable);
