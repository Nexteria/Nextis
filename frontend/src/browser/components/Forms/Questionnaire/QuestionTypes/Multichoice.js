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

    const selectedNumber = question.get('choices').filter(choice => choice.get('selected')).size;

    return (
      <div className="col-md-12">
        {question.get('required') && question.get('minSelection') > 1 ?
          <div>Označte minimálne {question.get('minSelection')} možností</div>
          : null
        }
        
        {question.get('choices').sort((a, b) => a.get('order') - b.get('order')).map(choice =>
          <div className="checkbox">
            <label>
              <span>{choice.get('title')}</span>
              <input
                type="checkbox"
                value={choice.get('id')}
                disabled={!choice.get('selected') && question.get('maxSelection') && selectedNumber >= question.get('maxSelection')}
                checked={question.hasIn(['answer', choice.get('id')])}
                style={{ left: 0, marginLeft: 0 }}
                onChange={e => {
                  if (e.target.checked) {
                    if (!question.has('answer')) {
                      onChange(
                        question.set('answer', new Map({}).set(e.target.value, true))
                                .setIn(['choices', choice.get('id'), 'selected'], true)
                      );
                    } else {
                      onChange(
                        question.setIn(['answer', e.target.value], true)
                                .setIn(['choices', choice.get('id'), 'selected'], true)
                      );
                    }
                  } else {
                    onChange(
                      question.deleteIn(['answer', e.target.value])
                              .setIn(['choices', choice.get('id'), 'selected'], false)
                    );
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
