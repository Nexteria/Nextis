import Component from 'react-pure-render/component';
import { FormattedTime, FormattedDate } from 'react-intl';
import React, { PropTypes } from 'react';
import Modal, { Header, Title, Body } from 'react-bootstrap/lib/Modal';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import SelectComponent from '../../components/Select';
import EventTerms from '../usersSection/EventTerms';
import * as eventActions from '../../../common/events/actions';

const styles = {
  signInTermLabel: {
    fontSize: '0.8em',
  },
};

export class ChooseTermStreamDialog extends Component {

  static propTypes = {
    closeDialog: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    terms: PropTypes.object.isRequired,
    locations: PropTypes.object.isRequired,
    choosedStream: PropTypes.object.isRequired,
    toggleEventTerm: PropTypes.func.isRequired,
    attendeeSignIn: PropTypes.func.isRequired,
    event: PropTypes.object.isRequired,
    viewerId: PropTypes.number.isRequired,
  }

  render() {
    const {
      open,
      closeDialog,
      terms,
      toggleEventTerm,
      choosedStream,
      event,
      viewerId,
      attendeeSignIn,
    } = this.props;

    const stream = terms.getIn(['streams', choosedStream]);
    const isTermMultiMeeting = stream && stream.get('terms').size > 0;

    return (
      <Modal
        show={open}
        dialogClassName="event-terms-modal"
        onHide={closeDialog}
      >
        <Header closeButton>
          <Title>Prihlásenie na event</Title>
        </Header>

        <Body>
          <div className="col-md-12">
            <Field
              label="Výber termínu"
              name="choosedStream"
              component={SelectComponent}
              normalize={value => parseInt(value, 10)}
            >
              <option disabled value="">Vyberte alternatívu</option>
              {terms.get('streams').valueSeq().map((v, index) =>
                <option
                  key={index}
                  value={v.get('id')}
                  disabled={v.get('signedInAttendeesCount') >= v.get('maxCapacity')}
                >
                Alternatíva #{index + 1} {v.get('signedInAttendeesCount') >= v.get('maxCapacity') && ' - plne obsadené'}
                </option>
              )}
            </Field>
          </div>
          <EventTerms event={event} selectedTermId={stream ? stream.get('id') : null} />
          {isTermMultiMeeting &&
            <div className="text-center text-danger">
              Tento termín je viacdielny. Budeš automaticky prihlásený na všetky stretnutia.
            </div>
          }
          <div className="text-center">
            <button
              type="button"
              onClick={closeDialog}
              className="btn btn-danger"
              style={{ marginRight: '1em' }}
            >Zrušiť</button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                toggleEventTerm(stream.get('id'), event.get('id'));
                closeDialog();
                attendeeSignIn(viewerId);
              }}
            >Záväzne sa prihlasujem</button>
          </div>
          <div className="clearfix"></div>
        </Body>
      </Modal>
    );
  }
}

ChooseTermStreamDialog = reduxForm({
  form: 'ChooseTermStreamDialog',
})(ChooseTermStreamDialog);

const selector = formValueSelector('ChooseTermStreamDialog');

export default connect(state => ({
  choosedStream: selector(state, 'choosedStream')
}), eventActions)(ChooseTermStreamDialog);
