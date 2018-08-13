import React from 'react';

export default class SelectList extends React.Component {
  render() {
    const {
      question,
      onChange,
      answer,
    } = this.props;

    const choiceId = answer;
    let selectedValue = 0;
    if (choiceId) {
      selectedValue = choiceId;
    }

    return (
      <div className="col-md-12">
        <select
          name={question.id}
          onChange={e => onChange(e.target.value)}
          value={selectedValue}
        >
          <option value={0} disabled>
            Vyberte jednu z možností
          </option>
          {[...question.choices].sort((a, b) => a.order - b.order).map(choice => (
            <option
              key={choice.id}
              value={choice.id}
            >
              {choice.title}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
