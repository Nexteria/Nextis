import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';


import * as eventActions from '../../../../common/events/actions';
import Question from './Question';

export class Form extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    attendeeGroupId: PropTypes.number.isRequired,
  }

  render() {
    const {
      form,
      attendeeGroupId,
      onChange,
    } = this.props;

    const description = form.get('groupDescriptions')[attendeeGroupId] ? form.get('groupDescriptions')[attendeeGroupId] : form.get('description');

    return (
      <div>
        <div className="col-md-12">
          <h1>{form.get('name')}</h1>
          {description.split('\n').map(descriptionPart =>
            <p style={{ fontSize: '1.2em' }}><i>{descriptionPart}</i></p>
          )}
        </div>
        <br/>
        {form.get('questions')
          .filter(q => q.get('groupSelection').size === 0 || q.hasIn(['groupSelection', attendeeGroupId])).sort((a, b) => a.get('order') - b.get('order'))
          .filter(question => question.get('dependentOn').every((q, qId) => q.every((choice, chId) => form.getIn(['questions', qId, 'choices', chId, 'selected']))))
          .valueSeq()
          .map((question, index) =>
            <Question
              key={question.get('id')}
              question={question}
              index={index}
              onChange={(data) => onChange(form.setIn(['questions', question.get('id')], data))}
            />
          )
        }
      </div>
    );
  }
}

export default connect(() => ({}), eventActions)(Form);
