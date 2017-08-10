import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';

import Select from '../../../Select';

export default class SelectList extends Component {

  static propTypes = {
    question: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }

  render() {
    const {
      question,
      onChange,
    } = this.props;

    const choiceId = question.get('answer');
    let selectedValue = 0;
    if (choiceId) {
      selectedValue = choiceId;
    }

    return (
      <div className="col-md-12">
        <Select
          input={{
            name: question.get(question.get('id')),
            onChange: e =>
              onChange(
                question.set('answer', e.target.value)
                        .update('choices', choices => choices.map(ch => ch.set('selected', ch.get('id') === e.target.value)))
              ),
            value: selectedValue,
          }}
          meta={{ asyncValidating: false, touched: false, error: false }}
        >
          <option value={0} disabled>Vyberte jednu z možností</option>
          {question.get('choices').sort((a, b) => a.get('order') - b.get('order')).map(choice =>
            <option
              key={choice.get('id')}
              value={choice.get('id')}
            >{choice.get('title')}</option>
          )}
        </Select>
      </div>
    );
  }
}
