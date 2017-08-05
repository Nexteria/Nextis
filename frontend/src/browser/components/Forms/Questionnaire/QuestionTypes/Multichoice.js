import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Map } from 'immutable';

export default class MultiChoice extends Component {

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
          <div className="checkbox">
            <label>
              <span>{choice.get('title')}</span>
              <input
                type="checkbox"
                value={choice.get('id')}
                style={{ left: 0, marginLeft: 0 }}
                onChange={e => {
                  if (e.target.checked) {
                    if (!question.has('answer')) {
                      onChange(question.set('answer', new Map({}).set(e.target.value, true)));
                    } else {
                      onChange(question.setIn(['answer', e.target.value], true));
                    }
                  } else {
                    onChange(question.deleteIn(['answer', e.target.value]));
                  }
                }}
              />
            </label>
          </div>
        )}
      </div>
    );
  }
}
