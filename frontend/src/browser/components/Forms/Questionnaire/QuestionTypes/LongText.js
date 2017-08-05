import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';

import TextArea from '../../../TextArea';

export default class LongText extends Component {

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
        <TextArea
          input={{
            name: question.get(question.get('id')),
            value: question.get('answer') || '',
            onChange: e => onChange(question.set('answer', e.target.value)),
          }}
          meta={{ asyncValidating: false, touched: false, error: false }}
          type="text"
        />
      </div>
    );
  }
}
