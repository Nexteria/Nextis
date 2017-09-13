import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';


import * as actions from '../../../../common/public/actions';
import Dialog from '../../../components/Dialog';
import TextArea from '../../../components/TextArea';
import BeforeEventQuestionnaire from '../BeforeEventQuestionnaire';
import { EventPublicLoginDialog } from '../../EventLoginDialog';


const validate = values => {
  const errors = {};
  if (!values.wontGoReason || values.wontGoReason.length < 10) {
    errors.wontGoReason = 'Napríš nám aspoň 10 znakov';
  }

  return errors;
};

class PublicSigninPage extends Component {

  static propTypes = {
    fetchEventSigninInfo: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    isSigned: PropTypes.bool,
    isSignedOut: PropTypes.bool,
    wontGo: PropTypes.bool,
    isEventMandatory: PropTypes.bool,
    signinForm: PropTypes.string,
    dataLoaded: PropTypes.bool,
    attendeeSignIn: PropTypes.func.isRequired,
    eventWontGo: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { fetchEventSigninInfo, eventWontGo, attendeeSignIn, params } = this.props;
    fetchEventSigninInfo(params.signInToken).then((data) => {
      const madeDecision = data.value.wontGo || data.value.isSignedOut || data.value.isSigned;
      if ((!data.value.isEventMandatory || madeDecision) && params.action === 'wontGo') {
        eventWontGo(params.signInToken);
      }

      if ((!data.value.signinFormId || madeDecision) &&
        params.action === 'signIn' && !data.value.groupedEvents.length) {
        attendeeSignIn(params.signInToken);
      }
    });
  }

  render() {
    const {
      isSigned,
      isSignedOut,
      wontGo,
      isEventMandatory,
      signinFormId,
      viewerId,
      groupId,
      eventId,
      dataLoaded,
      params,
      attendeeSignIn,
      message,
      groupedEvents,
      actionIsDone,
      handleSubmit,
      eventWontGo,
    } = this.props;

    const action = params.action;
    const signInToken = params.signInToken;

    if (!dataLoaded) {
      return <div></div>;
    }

    if (actionIsDone === true) {
      return (
        <Dialog>
          {message}
        </Dialog>
      );
    }

    return (
      <div>
        {(action === 'signIn' && !isSigned && signinFormId) &&
          <BeforeEventQuestionnaire
            params={{
              token: signinFormId,
              eventId,
            }}
            location={{
              state: {
                viewerId,
                groupId,
              }
            }}
            submitFunc={(data) => attendeeSignIn(params.signInToken, data)}
          />
        }

        {(action === 'signIn' && !isSigned && !signinFormId && groupedEvents.size) &&
          <EventPublicLoginDialog
            events={groupedEvents}
            params={{ eventId }}
            viewer={{ id: viewerId }}
            noRedirect
            attendeeSignIn={(e,v,g,f) => attendeeSignIn(params.signInToken, null, f)}
          />
        }

        {(action === 'signIn' && isSigned) &&
          <Dialog>
            <div style={{ textAlign: 'center' }}>
            Na event si sa už raz prihlásil!
            </div>
            <div style={{ textAlign: 'center' }}>
              Nezabudni prísť.
            </div>
          </Dialog>
        }

        {(action === 'wontGo' && (wontGo || isSignedOut)) &&
          <Dialog>
            <div style={{ textAlign: 'center' }}>
            Z eventu si sa už odhlásil.
            </div>
            <div style={{ textAlign: 'center' }}>
              Ak sa chceš znova prihlásiť sprav tak po prihlásení do Space-u
            </div>
          </Dialog>
        }

        {(action === 'wontGo' && (!wontGo && !isSignedOut && !isSigned) && isEventMandatory) &&
          <Dialog>
            <form onSubmit={handleSubmit((data) => eventWontGo(signInToken, data.wontGoReason))}>
              <div>
                <Field
                  name={'wontGoReason'}
                  type="text"
                  component={TextArea}
                  label={'Dôvod neúčasti'}
                />
                <button className="pull-right btn btn-danger">Odhlásiť</button>
                <div className="clearfix"></div>
              </div>
            </form>
          </Dialog>
        }
      </div>
    );
  }
}

PublicSigninPage = reduxForm({
  form: 'userEventsPage',
  validate
})(PublicSigninPage);

export default connect(state => ({
  isSigned: state.publicSignin.isSigned,
  isSignedOut: state.publicSignin.isSignedOut,
  wontGo: state.publicSignin.wontGo,
  isEventMandatory: state.publicSignin.isEventMandatory,
  dataLoaded: state.publicSignin.dataLoaded,
  signinFormId: state.publicSignin.signinFormId,
  viewerId: state.publicSignin.viewerId,
  groupId: state.publicSignin.groupId,
  message: state.publicSignin.message,
  actionIsDone: state.publicSignin.actionIsDone,
  eventId: state.publicSignin.eventId,
  groupedEvents: state.publicSignin.groupedEvents,
}), actions)(PublicSigninPage);
