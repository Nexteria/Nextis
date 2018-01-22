import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { Field, reduxForm } from 'redux-form';
import { browserHistory } from 'react-router';


import * as actions from '../../../common/guides/actions';
import InputComponent from '../../components/Input';


class EditGuideFieldDialog extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    createOrUpdateGuideFieldType: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    initialized: PropTypes.bool.isRequired,
    params: PropTypes.object,
    reset: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fields, initialize, params } = this.props;

    let data = {};

    if (params.fieldId) {
      const field = fields.get(parseInt(params.fieldId, 10));
      data = field.toObject();
    }

    initialize(data);
  }

  render() {
    const {
      handleSubmit,
      createOrUpdateGuideFieldType,
      initialized,
      fields,
      params,
    } = this.props;


    let field = null;
    if (params.fieldId) {
      field = fields.get(parseInt(params.fieldId, 10));
    }

    if (!initialized) {
      return <div />;
    }

    return (
      <Modal
        show
        bsSize="large"
        onHide={() => null}
      >
        <Header>
          {field ?
            <Title>Editácia typu údaju pre guidov</Title>
            :
            <Title>Vytvorenie typu údaju pre guidov</Title>
          }
        </Header>

        <Body>
          <form
            className="form-group"
            id="addGuideFieldTYpeForm"
            onSubmit={handleSubmit((data) =>
              createOrUpdateGuideFieldType(data, field ? field.get('id') : null)
            )}
          >
            <div className="col-md-12">
              <div className="col-md-6">
                <Field
                  name={'name'}
                  type="text"
                  component={InputComponent}
                  label={'Názov'}
                />
              </div>
              <div className="col-md-6">
                <Field
                  name={'codename'}
                  type="text"
                  component={InputComponent}
                  label={'Codename'}
                />
              </div>
              <div className="col-md-6">
                <Field
                  name={'order'}
                  type="number"
                  component={InputComponent}
                  label={'Poradie'}
                />
              </div>
              <div className="clearfix" />
              <div className="text-center">
                <Field
                  name={'required'}
                  type="checkbox"
                  contentColumn={1}
                  inputStyle={{ margin: 'auto' }}
                  component={InputComponent}
                  label={'Povinné'}
                />
              </div>
            </div>
            <div className="clearfix" />
          </form>
        </Body>

        <Footer>
          <div className="col-md-12">
            <button
              className="btn btn-danger"
              onClick={() => browserHistory.goBack()}
            >
              Zrušiť
            </button>
            <button
              className="btn btn-success"
              type="submit"
              form="addGuideFieldTYpeForm"
            >
              {field ? 'Uložiť' : 'Vytvoriť'}
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Povinné pole';
  }

  if (values.name && values.name.length > 254) {
    errors.name = 'Maximálna dĺžka textu je 255 znakov';
  }

  if (!values.codename) {
    errors.codename = 'Povinné pole';
  }

  if (values.codename && !/^\w+$/.test(values.codename)) {
    errors.codename = 'Codename môže obsahovať iba písmená anglickej abecedy, čísla a znak _';
  }

  return errors;
};

EditGuideFieldDialog = reduxForm({
  form: 'EditGuideFieldDialog',
  validate,
  onSubmitSuccess: (r, d, props) => { props.reset(); browserHistory.goBack(); },
})(EditGuideFieldDialog);

export default connect((state) => ({
  fields: state.guides.get('fields'),
}), actions)(EditGuideFieldDialog);
