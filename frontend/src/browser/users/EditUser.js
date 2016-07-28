import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import shortid from 'shortid';

import './SettingsPage.scss';
import { fields } from '../../common/lib/redux-fields/index';
import * as fieldsActions from '../../common/lib/redux-fields/actions';

const messages = defineMessages({
  student: {
    defaultMessage: 'Nexteria student',
    id: 'user.edit.personType.student',
  },
  firstName: {
    defaultMessage: 'First name',
    id: 'user.edit.firstName',
  },
  lastName: {
    defaultMessage: 'Last name',
    id: 'user.edit.lastName',
  },
  email: {
    defaultMessage: 'Email',
    id: 'user.edit.email',
  },
  phone: {
    defaultMessage: 'Phone',
    id: 'user.edit.phone',
  },
  save: {
    defaultMessage: 'Save',
    id: 'user.edit.save',
  },
  facebookLink: {
    defaultMessage: 'Facebook link',
    id: 'user.edit.facebookLink',
  },
  linkedinLink: {
    defaultMessage: 'LinkedIn link',
    id: 'user.edit.linkedinLink',
  },
  personalDescription: {
    defaultMessage: 'Personal description',
    id: 'user.edit.personalDescription',
  },
  actualJob: {
    defaultMessage: 'Actual job',
    id: 'user.edit.actualJob',
  },
  school: {
    defaultMessage: 'School',
    id: 'user.edit.school',
  },
  faculty: {
    defaultMessage: 'Faculty',
    id: 'user.edit.faculty',
  },
  studyProgram: {
    defaultMessage: 'Study program',
    id: 'user.edit.studyProgram',
  },
  variableSymbol: {
    defaultMessage: 'Variable symbol',
    id: 'user.edit.variableSymbol',
  },
});

export class EditUser extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    mode: PropTypes.string,
    title: PropTypes.object.isRequired,
    user: PropTypes.object,
    saveUser: PropTypes.func.isRequired,
    setField: PropTypes.func,
  }

  componentWillMount() {
    const { setField } = this.props;

    setField(['editUser'], null);
  }

  render() {
    const { fields, mode, title } = this.props;
    const { saveUser } = this.props;

    return (
      <div>
        <section className="content-header">
          <h1>{title}</h1>
        </section>

        <section className="content">
          <div className="row">
            <div className="col-md-3">
              <div className="box box-primary">
                <div className="box-body box-profile">
                  {fields.picture ?
                    <img
                      className="profile-user-img img-responsive img-circle"
                      src="{fields.picture}"
                      alt={`${fields.firstName.value} ${fields.lastName.value}`}
                    />
                    : <i className="fa fa-user avatar-icon-profile"></i>
                  }

                  <h3 className="profile-username text-center">
                    {`${fields.firstName.value} ${fields.lastName.value}`}
                  </h3>

                  <p className="text-muted text-center">
                    <FormattedMessage {...messages[fields.personType.value]} />
                  </p>

                  <ul className="list-group list-group-unbordered">
                    <li className="list-group-item text-center">
                      <b><FormattedMessage {...messages.variableSymbol} /></b>
                      <input
                        type="text"
                        className="form-control"
                        {...fields.variableSymbol}
                        id="variableSymbol"
                        readOnly={mode !== 'create'}
                      />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="nav-tabs-custom">
                <div className="tab-content">
                  <div className="tab-pane active" id="settings">
                    <form className="form-horizontal">
                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.firstName} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.firstName}
                            id="firstName"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.lastName} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.lastName}
                            id="lastName"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.email} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="email"
                            className="form-control"
                            {...fields.email}
                            id="email"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.phone} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.phone}
                            id="phone"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.facebookLink} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.facebookLink}
                            id="facebookLink"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputName" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.linkedinLink} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.linkedinLink}
                            id="linkedinLink"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="personalDescription" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.personalDescription} />
                        </label>

                        <div className="col-sm-10">
                          <textarea
                            className="form-control"
                            rows="3"
                            {...fields.personalDescription}
                            id="personalDescription"
                            placeholder="Personal description ..."
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="actualJob" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.actualJob} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.actualJob}
                            id="actualJob"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="school" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.school} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.school}
                            id="school"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="faculty" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.faculty} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.faculty}
                            id="faculty"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="studyProgram" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.studyProgram} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.studyProgram}
                            id="studyProgram"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                          <button type="button" className="btn btn-danger" onClick={() => saveUser(fields)}>
                            <FormattedMessage {...messages.save} />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>
    );
  }
}

function getFieldsInitialState(props) {
  if (props.user) {
    return {
      uid: props.user.uid,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      email: props.user.email,
      phone: props.user.phone,
      facebookLink: props.user.facebookLink,
      linkedinLink: props.user.linkedinLink,
      actualJob: props.user.actualJob,
      school: props.user.school,
      faculty: props.user.faculty,
      studyProgram: props.user.studyProgram,
      personalDescription: props.user.personalDescription,
      variableSymbol: props.user.variableSymbol,
      personType: props.user.personType
    };
  }

  return {
    uid: shortid.generate(),
    firstName: '',
    lastName: '',
    email: null,
    phone: null,
    facebookLink: null,
    linkedinLink: null,
    actualJob: null,
    school: null,
    faculty: null,
    studyProgram: null,
    personalDescription: '',
    variableSymbol: null,
    personType: 'student',
  };
}

EditUser = fields(EditUser, {
  path: 'editUser',
  fields: [
    'uid',
    'firstName',
    'lastName',
    'email',
    'facebookLink',
    'linkedinLink',
    'phone',
    'actualJob',
    'school',
    'faculty',
    'studyProgram',
    'personalDescription',
    'personType',
    'variableSymbol',
  ],
  getInitialState: getFieldsInitialState,
});

EditUser = injectIntl(EditUser);

export default connect(() => ({
}), fieldsActions)(EditUser);
