import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  gaindePointsFromAll: {
    defaultMessage: 'Body so všetkých získateľných',
    id: 'viewer.activityPoints.gaindePointsFromAll'
  },
  minimumSemesterActivityPoints: {
    defaultMessage: 'Minimum bodov za semester',
    id: 'viewer.activityPoints.minimumSemesterActivityPoints'
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
            <th><FormattedMessage {...messages.gaindePointsFromAll} />:</th>
            <th>{viewer.potentialActivityPoints === 0 ? 0 :
              Math.round(viewer.gainedActivityPoints / viewer.potentialActivityPoints * 100)} %</th>
          </tr>
          <tr>
            <td><FormattedMessage {...messages.minimumSemesterActivityPoints} />:</td>
            <td>{viewer.minimumSemesterActivityPoints}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}
