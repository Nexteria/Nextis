import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default class Multichoice extends Component {

  static propTypes = {
    question: PropTypes.object.isRequired,
    results: PropTypes.object.isRequired,
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  render() {
    const {
      question,
      results,
    } = this.props;

    const data = results.map((choice, key) => ({
      name: question.getIn(['choices', key, 'title']),
      value: choice.filter(answer => answer.get('answer') === 'selected').size,
      fill: this.getRandomColor(),
    })).toArray();

    return (
      <div className="row">
        <div className="col-md-12">
          <table
            className="table table-hover"
            style={{ width: 'auto', maxWidth: '500px', margin: 'auto' }}
          >
            <thead>
              <tr>
                <th>Možnosť</th>
                <th># Odpovedí</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item =>
                <tr>
                  <td>{item.name}</td>
                  <td className="text-center">{item.value}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="col-md-12 text-center">
          <BarChart
            style={{ margin: 'auto' }}
            width={350}
            height={240}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    );
  }
}
