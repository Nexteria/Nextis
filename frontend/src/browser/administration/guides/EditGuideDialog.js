import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { browserHistory } from 'react-router';
import { Field, reduxForm } from 'redux-form';
import validator from 'validator';
import RichTextEditor from 'react-rte';

import * as actions from '../../../common/guides/actions';
import InputComponent from '../../components/Input';
import TextEditorComponent from '../../components/TextEditor';
import FileUpload from '../../components/FileUpload';

class EditGuideDialog extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    editGuide: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    guides: PropTypes.object.isRequired,
    params: PropTypes.object,
    fields: PropTypes.object.isRequired,
    initialized: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { guides, fields, initialize, params } = this.props;

    const data = {
      firstName: '',
      lastName: '',
      email: '',
      currentOccupation: '',
      linkedInUrl: '',
    };

    if (params.guideId) {
      const guide = guides.get(parseInt(params.guideId, 10));
      data.firstName = guide.get('firstName');
      data.lastName = guide.get('lastName');
      data.email = guide.get('email');
      data.currentOccupation = guide.get('currentOccupation');
      data.linkedInUrl = guide.get('linkedInUrl');
    }

    fields.forEach(field => {
      let html = '';
      if (params.guideId) {
        const guide = guides.get(parseInt(params.guideId, 10));
        const gField = guide.get('fields').filter(guideField =>
          guideField.get('fieldTypeId') === field.get('id')
        ).first();

        if (gField) {
          html = gField.get('value');
          data[`${field.get('codename')}_needUpdates`] = gField.get('needUpdates') || false;
        }
      }
      data[field.get('codename')] = RichTextEditor.createValueFromString(html, 'html');
    });

    initialize(data);
  }

  render() {
    const {
      guides,
      fields,
      handleSubmit,
      editGuide,
      initialized,
      params,
    } = this.props;


    let guide = null;
    if (params.guideId) {
      guide = guides.get(parseInt(params.guideId, 10));
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
          {guide ?
            <Title>Editácia guida</Title>
            :
            <Title>Pridanie nového guida</Title>
          }
        </Header>

        <Body>
          <form
            className="form-group"
            id="addGuideFieldTYpeForm"
            onSubmit={handleSubmit((data) => {
              if (guide) {
                editGuide(data, guide.get('id'));
              } else {
                editGuide(data);
              }
            })}
          >
            <div className="cold-md-12">
              <div className="col-md-6">
                <div className="col-md-12">
                  <Field
                    name={'firstName'}
                    type="text"
                    component={InputComponent}
                    label={'Meno'}
                  />
                </div>
                <div className="col-md-12">
                  <Field
                    name={'lastName'}
                    type="text"
                    component={InputComponent}
                    label={'Priezvisko'}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="col-md-12">
                  <Field
                    name={'email'}
                    type="email"
                    component={InputComponent}
                    label={'Email'}
                  />
                </div>
                <div className="col-md-12">
                  <Field
                    name={'linkedInUrl'}
                    type="text"
                    component={InputComponent}
                    label={'LinkedIn url'}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <Field
                  name={'currentOccupation'}
                  type="text"
                  component={InputComponent}
                  label={'Aktuálna pozícia'}
                />
              </div>
              <div className="cold-md-12">
                <Field
                  name="photo"
                  component={FileUpload}
                  accept="image/*"
                  label={guide && guide.get('profile_picture') ?
                    <img height={200} src={guide.get('profile_picture').filePath} alt="Profile" />
                    : 'Nahrať fotku'
                  }
                />
              </div>
              {fields.map(field =>
                <div className="col-md-12">
                  <Field
                    name={field.get('codename')}
                    component={TextEditorComponent}
                    label={field.get('name')}
                  />
                  <Field
                    name={`${field.get('codename')}_needUpdates`}
                    component={InputComponent}
                    type="checkbox"
                    labelCol={2}
                    contentCol={1}
                    label="Potrebný update:"
                    inputStyle={{ marginBottom: '2em' }}
                  />
                </div>
              )}
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
              {guide ? 'Upraviť' : 'Vytvoriť'}
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

const validate = (values) => {
  const errors = {};

  const required = [
    'firstName',
    'lastName',
    'email',
    'linkedInUrl',
    'currentOccupation',
  ];

  if (values.email && !validator.isEmail(values.email)) {
    errors.email = 'Prosím zadajte valídny email';
  }

  if (values.linkedInUrl && !validator.isURL(values.linkedInUrl)) {
    errors.linkedInUrl = 'Prosím zadajte valídnu url';
  }

  required.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Povinné pole';
    }
  });

  return errors;
};

EditGuideDialog = reduxForm({
  form: 'EditGuideDialog',
  validate,
  onSubmitSuccess: (r, d, props) => { props.reset(); browserHistory.goBack(); },
})(EditGuideDialog);

export default connect(state => ({
  guides: state.guides.guides,
  fields: state.guides.fields,
}), { ...actions })(EditGuideDialog);
