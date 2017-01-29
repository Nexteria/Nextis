import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  gaindePointsFromAll: {
    defaultMessage: 'Goined points from all possible',
    id: 'viewer.activityPoints.gaindePointsFromAll'
  },
  studetsMinimumPortionOfBasePoints: {
    defaultMessage: '75% of your base points amount',
    id: 'viewer.activityPoints.studetsMinimumPortionOfBasePoints'
  },
});

export default class OverviewTable extends Component {

  static propTypes = {
    viewer: PropTypes.object,
  };
  render() {
    const {
      viewer,
    } = this.props;

    return (
      <table className="table table-bordered">
        <tbody>
          <tr>
            <td><FormattedMessage {...messages.studetsMinimumPortionOfBasePoints} />:</td>
            <td>{viewer.minimumSemesterActivityPoints}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}