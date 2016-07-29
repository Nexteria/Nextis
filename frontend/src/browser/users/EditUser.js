import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { List } from 'immutable';

import './SettingsPage.scss';
import { fields } from '../../common/lib/redux-fields/index';
import * as fieldsActions from '../../common/lib/redux-fields/actions';
import './EditUser.scss';
import User from '../../common/users/models/User';

const messages = defineMessages({
  student: {
    defaultMessage: 'Nexteria Student',
    id: 'user.edit.role.student',
  },
  alumni: {
    defaultMessage: 'Nexteria Alumni',
    id: 'user.edit.role.alumni',
  },
  supporter: {
    defaultMessage: 'Nexteria Supporter',
    id: 'user.edit.role.supporter',
  },
  buddy: {
    defaultMessage: 'Nexteria Buddy',
    id: 'user.edit.role.buddy',
  },
  admin: {
    defaultMessage: 'Nexteria Admin',
    id: 'user.edit.role.admin',
  },
  lector: {
    defaultMessage: 'Nexteria Lector',
    id: 'user.edit.role.lector',
  },
  guide: {
    defaultMessage: 'Nexteria Guide',
    id: 'user.edit.role.guide',
  },
  nexteriaTeam: {
    defaultMessage: 'Nexteria Team member',
    id: 'user.edit.role.nexteriaTeam',
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
  actualJobInfo: {
    defaultMessage: 'Actual job',
    id: 'user.edit.actualJobInfo',
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
  personRoles: {
    defaultMessage: 'Person roles',
    id: 'user.edit.personRoles',
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
    rolesList: PropTypes.object.isRequired,
    updateUserRole: PropTypes.func,
  }

  componentWillMount() {
    const { setField, user } = this.props;

    setField(['editUser'], user ? user : new User());
  }

  render() {
    const { fields, mode, title, rolesList } = this.props;
    const { saveUser, updateUserRole } = this.props;
    const { formatMessage } = this.props.intl;

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

                  {mode === 'create' ?
                    <div className="form-group text-left">
                      <label><FormattedMessage {...messages.personRoles} /></label>
                        {rolesList.map(type =>
                          <div className="checkbox" key={type}>
                            <label>
                              <input
                                type="checkbox"
                                onChange={() => updateUserRole(type, !fields.roles.value.includes(type))}
                                checked={fields.roles.value.includes(type)}
                              />
                              <FormattedMessage {...messages[type]} />
                            </label>
                          </div>
                        )}
                    </div>
                    :
                    <p className={`${mode === 'create' ? '' : 'text-muted'} text-center`}>
                      {fields.roles.value.map(role => 
                        <FormattedMessage key={role} {...messages[role]} />
                      )}
                    </p>
                  }

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
                        <label htmlFor="actualJobInfo" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.actualJobInfo} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.actualJobInfo}
                            id="actualJobInfo"
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
    'photo',
    'actualJobInfo',
    'school',
    'faculty',
    'studyProgram',
    'personalDescription',
    'roles',
    'variableSymbol',
  ],
});

EditUser = injectIntl(EditUser);

export default connect((state) => ({
  rolesList: state.users.rolesList,
}), fieldsActions)(EditUser);
