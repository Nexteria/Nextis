import React, { PropTypes } from 'react';
import LinearProgress from 'material-ui/LinearProgress';


import Icon from '../components/Icon';

export default class EventActivityDetail extends React.PureComponent {

  static propTypes = {
    data: PropTypes.object,
  };

  render() {
    const { data } = this.props;

    if (!data) {
      return (
        <div><LinearProgress mode="indeterminate" /></div>
      );
    }

    return (
      <div className="box-body table-responsive text-center" style={{ backgroundColor: '#bfbfbf' }}>
        <table className="table table-hover text-center">
          <tbody>
            <tr>
              <th>Prihlásený</th>
              <th>Prítomný</th>
              <th>Vyplnený feedback</th>
            </tr>
            <tr>
              <td><Icon type={data.get('signedIn') ? 'check' : 'close'} /></td>
              <td><Icon type={data.get('wasPresent') ? 'check' : 'close'} /></td>
              <td><Icon type={data.get('filledFeedback') ? 'check' : 'close'} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
