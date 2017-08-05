import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import {PieChart, Pie, Legend, Tooltip } from 'recharts';

export default class SelectList extends Component {

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
          <PieChart width={350} height={240} style={{ margin: 'auto' }}>
            <Pie
              nameKey="name"
              data={data}
              cx={180}
              cy={120}
              innerRadius={40}
              outerRadius={80}
              label={(data) => data.payload.name}
            />
            <Tooltip />
          </PieChart>
        </div>
      </div>
    );
  }
}
