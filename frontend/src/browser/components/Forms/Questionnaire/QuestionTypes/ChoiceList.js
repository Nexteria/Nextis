import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';

export default class ChoiceList extends Component {

  static propTypes = {
    question: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const {
      question,
      onChange,
    } = this.props;

    return (
      <div className="col-md-12">
        {question.get('choices').sort((a, b) => a.get('order') - b.get('order')).map(choice =>
          <div className="radio">
            <label>
              {choice.get('title')}
              <input
                type="radio"
                name={question.get('id')}
                value={choice.get('id')}
                checked={choice.get('id') === question.get('answer')}
                onChange={e => onChange(question.set('answer', e.target.value))}
                style={{ left: 0, marginLeft: 0 }}
              />
            </label>
          </div>
        )}
      </div>
    );
  }
}
