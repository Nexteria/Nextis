import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';

export default class ShortText extends Component {

  static propTypes = {
    question: PropTypes.object.isRequired,
    results: PropTypes.object.isRequired,
  }

  render() {
    const {
      results,
    } = this.props;

    return (
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Odpoveď</th>
            </tr>
          </thead>
          <tbody>
            {results.first().filter(result => result.get('answer') !== '').map((result, index) =>
              <tr>
                <td>{index + 1}</td>
                <td>{result.get('answer')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
