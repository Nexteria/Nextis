import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { browserHistory } from 'react-router';

import * as actions from '../../common/students/actions';
import SelectComponent from '../components/Select';
import TextAreaComponent from '../components/TextArea';

class GuideOption extends Component {

  static propTypes = {
    student: PropTypes.object.isRequired,
    option: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    updateGuideOption: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { option, initialize } = this.props;

    initialize(option.pivot);
  }

  render() {
    const { student, option, handleSubmit, updateGuideOption } = this.props;

    const priorities = student.get('guidesOptions').map(option => option.pivot.priority);
    const isReadonly = option.pivot.created_at != option.pivot.updated_at;

    return (
      <div className="container box">
        <h4>
          <span>{option.firstName} {option.lastName}</span>
          <button
            className="btn btn-info btn-xs pull-right"
            onClick={() => browserHistory.push(`/guides/${option.id}`)}
          >
            Zobraziť profil
          </button>
        </h4>
        <form
          className="form-group"
          onSubmit={handleSubmit((data) => updateGuideOption(data, option.pivot.id))}
        >
          <Field
            name={'priority'}
            component={SelectComponent}
            label="Preferencia (1 - preferujem najviac)"
            readOnly={isReadonly}
          >
            <option disabled>Prosím vyber možnosť</option>
            <option value={-1}>Nemám záujem o tohto guida</option>
            {priorities.map((value, index) =>
              <option key={index} value={index + 1} disabled={priorities.includes(index + 1)}>{index + 1}</option>
            )}
          </Field>

          <Field
            name={'whyIWouldChooseThisGuide'}
            component={TextAreaComponent}
            label="Napíš nám, na čom chceš pomocou tohto guida pracovať. Chceme mu(jej) to poslať, aby mal aj on(ona) jasnejšiu predstavu o Tebe a zároveň chceme predísť zlej interpretácii z našej strany. Môžeš stručne zosumarizovať aj to, čo si nám poslal(a) v prihláške."
            readOnly={isReadonly}
          />

          {!isReadonly ?
            <div className="pull-right text-right">
              <button
                className="btn btn-success btn-xs"
                type="submit"
              >
                Odoslať
              </button>
              <div>* zmeny sa dajú po odoslaní riešiť už iba priamo s Betkou</div>
            </div>
            : null
          }
          <div className="clearfix" />
        </form>
      </div>
    );
  }
}

GuideOption = reduxForm({
  validate: (values) => {
    const errors = {};

    const required = ['priority', 'whyIWouldChooseThisGuide'];

    required.forEach(item => {
      if (!values[item]) {
        errors[item] = 'Položka je povinná';
      }
    });

    return errors;
  }
})(GuideOption);

export default connect(state => ({
  student: state.users.viewerRolesData.get('student'),
}), actions)(GuideOption);
