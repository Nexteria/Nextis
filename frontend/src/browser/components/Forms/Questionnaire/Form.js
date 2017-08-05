import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


import * as eventActions from '../../../../common/events/actions';
import Question from './Question';

export class Form extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  render() {
    const {
      form,
      onChange,
    } = this.props;

    return (
      <div>
        <div className="col-md-12">
          <h1>{form.get('name')}</h1>
          <p>{form.get('description')}</p>
        </div>
        {form.get('questions').sort((a, b) => a.get('order') - b.get('order')).map(question =>
          <Question
            key={question.get('id')}
            question={question}
            onChange={(data) => onChange(form.setIn(['questions', question.get('id')], data))}
          />
        )}
      </div>
    );
  }
}

export default connect(() => ({}), eventActions)(Form);
