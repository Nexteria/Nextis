import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';


import TextEditor from '../components/TextEditor';
import './SettingsPage.scss';
import { fields } from '../../common/lib/redux-fields/index';
import * as fieldsActions from '../../common/lib/redux-fields/actions';
import * as actions from '../../common/users/actions';
import './EditUser.scss';
import User from '../../common/users/models/User';

const messages = defineMessages({
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
  iban: {
    defaultMessage: 'Iban',
    id: 'user.edit.iban',
  },
  variableSymbol: {
    defaultMessage: 'Variable symbol',
    id: 'user.edit.variableSymbol',
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
  personRoles: {
    defaultMessage: 'Person roles',
    id: 'user.edit.personRoles',
  },
  buddyDescription: {
    defaultMessage: 'Buddy description',
    id: 'user.edit.buddyDescription',
  },
  lectorDescription: {
    defaultMessage: 'Lector description',
    id: 'user.edit.lectorDescription',
  },
  guideDescription: {
    defaultMessage: 'Gide description',
    id: 'user.edit.guideDescription',
  },
  studentLevel: {
    defaultMessage: 'Student level',
    id: 'user.edit.studentLevel',
  },
  nexteriaTeamRole: {
    defaultMessage: 'Nexteria team role',
    id: 'user.edit.nexteriaTeamRole',
  },
  userState: {
    defaultMessage: 'User state',
    id: 'user.edit.userState',
  },
  activeUserState: {
    defaultMessage: 'Active',
    id: 'user.edit.activeUserState',
  },
  inactiveUserState: {
    defaultMessage: 'Inactive',
    id: 'user.edit.inactiveUserState',
  },
  temporarySuspendedUserState: {
    defaultMessage: 'Temporary suspended',
    id: 'user.edit.temporarySuspendedUserState',
  },
  username: {
    defaultMessage: 'Username',
    id: 'user.edit.username',
  },
  chooseStudentLevel: {
    defaultMessage: 'Choose student level',
    id: 'user.edit.chooseStudentLevel',
  },
  expelledUserState: {
    defaultMessage: 'Expelled',
    id: 'user.edit.expelledUserState',
  },
  endedUserState: {
    defaultMessage: 'Ended',
    id: 'user.edit.endedUserState',
  },
  oldPassword: {
    defaultMessage: 'Old password',
    id: 'user.edit.oldPassword',
  },
  newPassword: {
    defaultMessage: 'New password',
    id: 'user.edit.newPassword',
  },
  confirmationPassword: {
    defaultMessage: 'Confirmation password',
    id: 'user.edit.confirmationPassword',
  },
});

export class EditUser extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    mode: PropTypes.string,
    title: PropTypes.object,
    user: PropTypes.object,
    saveUser: PropTypes.func.isRequired,
    setField: PropTypes.func,
    rolesList: PropTypes.object,
    updateUserRole: PropTypes.func,
    studentLevels: PropTypes.object,
    intl: PropTypes.object.isRequired,
    loadRolesList: PropTypes.func.isRequired,
    loadStudentLevelsList: PropTypes.func.isRequired,
    params: PropTypes.object,
    users: PropTypes.object.isRequired,
    hasPermission: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { setField, users, user, params } = this.props;

    const userId = params ? params.userId : null;
    let activeUser = user;

    if (userId) {
      activeUser = users.get(parseInt(userId, 10));
    }

    setField(['editUser'], activeUser ? activeUser : new User());
  }

  render() {
    const { fields, mode, title, rolesList, studentLevels } = this.props;
    const { saveUser, updateUserRole, hasPermission } = this.props;
    const { formatMessage } = this.props.intl;

    if (!fields.roles.value || !rolesList) {
      return <div></div>;
    }

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

                  {mode !== 'profile' ?
                    <div className="form-group text-left">
                      <label><FormattedMessage {...messages.personRoles} /></label>
                        {rolesList.valueSeq().map(role =>
                          <div className="checkbox" key={role.id}>
                            <label>
                              <input
                                type="checkbox"
                                onChange={() => updateUserRole(role.id, !fields.roles.value.includes(role.id))}
                                checked={fields.roles.value.includes(role.id)}
                              />
                              {role.display_name}
                            </label>
                          </div>
                        )}
                    </div>
                    : ''
                  }
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
                        <label htmlFor="username" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.username} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.username}
                            id="username"
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

                      {fields.roles.value.includes(rolesList.get('STUDENT').id) ?
                        <div className="form-group">
                          <label htmlFor="inputName" className="col-sm-2 control-label">
                            <FormattedMessage {...messages.studentLevel} />
                          </label>

                          <div className="col-sm-10">
                            <select
                              className="form-control"
                              {...fields.studentLevelId}
                              id="studentLevel"
                            >
                              <option readOnly>{formatMessage(messages.chooseStudentLevel)}</option>
                              {studentLevels.valueSeq().map(level =>
                                <option key={level.id} value={level.id}>{level.name}</option>
                              )}
                            </select>
                          </div>
                        </div>
                        : ''
                      }

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
                        <label htmlFor="iban" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.iban} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            {...fields.iban}
                            id="iban"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="iban" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.variableSymbol} />
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            readOnly
                            value={fields.variableSymbol.value}
                            id="variableSymbol"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="personalDescription" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.personalDescription} />
                        </label>

                        <div className="col-sm-10">
                          <TextEditor
                            value={fields.personalDescription.value}
                            onChange={(value) =>
                              fields.personalDescription.onChange({ target: { value } })
                            }
                            id="personalDescription"
                            placeholder="Personal description ..."
                          />
                        </div>
                      </div>

                      {fields.roles.value.includes(rolesList.get('GUIDE').id) ?
                        <div className="form-group">
                          <label htmlFor="guideDescription" className="col-sm-2 control-label">
                            <FormattedMessage {...messages.guideDescription} />
                          </label>

                          <div className="col-sm-10">
                            <TextEditor
                              value={fields.guideDescription.value}
                              onChange={(value) =>
                                fields.guideDescription.onChange({ target: { value } })
                              }
                              id="guideDescription"
                              placeholder="Gide description ..."
                            />
                          </div>
                        </div>
                        : ''
                      }

                      {fields.roles.value.includes(rolesList.get('LECTOR').id) ?
                        <div className="form-group">
                          <label htmlFor="lectorDescription" className="col-sm-2 control-label">
                            <FormattedMessage {...messages.lectorDescription} />
                          </label>

                          <div className="col-sm-10">
                            <TextEditor
                              value={fields.lectorDescription.value}
                              onChange={(value) =>
                                fields.lectorDescription.onChange({ target: { value } })
                              }
                              id="lectorDescription"
                              placeholder="Lector description ..."
                            />
                          </div>
                        </div>
                        : ''
                      }

                      {fields.roles.value.includes(rolesList.get('BUDDY').id) ?
                        <div className="form-group">
                          <label htmlFor="buddyDescription" className="col-sm-2 control-label">
                            <FormattedMessage {...messages.buddyDescription} />
                          </label>

                          <div className="col-sm-10">
                            <TextEditor
                              value={fields.buddyDescription.value}
                              onChange={(value) =>
                                fields.buddyDescription.onChange({ target: { value } })
                              }
                              id="buddyDescription"
                              placeholder="Buddy description ..."
                            />
                          </div>
                        </div>
                        : ''
                      }

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
                        <label htmlFor="userState" className="col-sm-2 control-label">
                          <FormattedMessage {...messages.userState} />
                        </label>

                        <div className="col-sm-10">
                          <select
                            className="form-control"
                            {...fields.state}
                            id="userState"
                          >
                            <option value={'active'}>
                              {formatMessage(messages.activeUserState)}
                            </option>
                            <option value={'inactive'}>
                              {formatMessage(messages.inactiveUserState)}
                            </option>
                            <option value={'temporarySuspended'}>
                              {formatMessage(messages.temporarySuspendedUserState)}
                            </option>
                            <option value={'temporarySuspended'}>
                              {formatMessage(messages.expelledUserState)}
                            </option>
                            <option value={'temporarySuspended'}>
                              {formatMessage(messages.endedUserState)}
                            </option>
                          </select>
                        </div>
                      </div>

                      {fields.roles.value.includes(rolesList.get('NEXTERIA_TEAM').id) ?
                        <div className="form-group">
                          <label htmlFor="nexteriaTeamRole" className="col-sm-2 control-label">
                            <FormattedMessage {...messages.nexteriaTeamRole} />
                          </label>

                          <div className="col-sm-10">
                            <input
                              type="text"
                              className="form-control"
                              {...fields.nexteriaTeamRole}
                              id="nexteriaTeamRole"
                            />
                          </div>
                        </div>
                        : ''
                      }

                      {fields.id.value === null ?
                        <div>
                          <div className="form-group">
                            <label htmlFor="newPassword" className="col-sm-2 control-label">
                              <FormattedMessage {...messages.newPassword} />
                            </label>

                            <div className="col-sm-10">
                              <input
                                type="password"
                                className="form-control"
                                {...fields.newPassword}
                                id="newPassword"
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label htmlFor="confirmationPassword" className="col-sm-2 control-label">
                              <FormattedMessage {...messages.confirmationPassword} />
                            </label>

                            <div className="col-sm-10">
                              <input
                                type="password"
                                className="form-control"
                                {...fields.confirmationPassword}
                                id="confirmationPassword"
                              />
                            </div>
                          </div>
                        </div>
                        : ''
                      }

                      {(fields.id.value && hasPermission('update_users')) || (!fields.id.value && hasPermission('create_users')) || mode === 'profile' ?
                        <div className="form-group">
                          <div className="col-sm-offset-2 col-sm-10">
                            <button type="button" className="btn btn-success" onClick={() => saveUser(fields, rolesList)}>
                              <FormattedMessage {...messages.save} />
                            </button>
                          </div>
                        </div>
                        : ''
                      }
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
    'id',
    'username',
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
    'iban',
    'variableSymbol',
    'lectorDescription',
    'guideDescription',
    'buddyDescription',
    'nexteriaTeamRole',
    'studentLevelId',
    'state',
    'newPassword',
    'oldPassword',
    'confirmationPassword',
  ],
});

EditUser = injectIntl(EditUser);

export default connect((state) => ({
  rolesList: state.users.rolesList,
  users: state.users.users,
  studentLevels: state.users.studentLevels,
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), { ...fieldsActions, ...actions })(EditUser);
