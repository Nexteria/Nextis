import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal, { Header, Title, Body, Footer } from 'react-bootstrap/lib/Modal';
import { Field, reduxForm } from 'redux-form';
import { browserHistory } from 'react-router';


import * as studentsActions from '../../common/students/actions';
import InputComponent from '../components/Input';


class ActivityPointsEditDialog extends Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    activityId: PropTypes.number.isRequired,
    initialize: PropTypes.func.isRequired,
    updateActivityPoints: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      initialize,
      activityId,
      student,
    } = this.props;

    const activity = student.get('activityPoints').find(
      activity => activity.get('id') === activityId
    );

    initialize({
      gainedPoints: activity.get('gainedPoints'),
      maxPossiblePoints: activity.get('maxPossiblePoints'),
      id: activity.get('id'),
      studentId: activity.get('studentId'),
    });
  }

  render() {
    const {
      handleSubmit,
      activityId,
      student,
      updateActivityPoints,
      reset,
    } = this.props;

    const activity = student.get('activityPoints').find(
      activity => activity.get('id') === activityId
    );

    return (
      <Modal
        show
        bsSize="large"
        onHide={() => null}
      >
        <Header>
          <Title>{activity.get('activityName')}</Title>
        </Header>

        <Body>
          <form
            className="form-group"
            id="editActivityPoints"
            onSubmit={handleSubmit((data) => {
              updateActivityPoints(data);
              reset();
              browserHistory.goBack();
            })}
          >
            <div className="col-md-12">
              <div className="col-md-6">
                <Field
                  name={'gainedPoints'}
                  type="number"
                  component={InputComponent}
                  label={'Získané body'}
                />
              </div>
              <div className="col-md-6">
                <Field
                  name={'maxPossiblePoints'}
                  type="number"
                  component={InputComponent}
                  label={'Možné maximum bodov'}
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
              form="editActivityPoints"
            >
              Zmeniť body
            </button>
          </div>
        </Footer>
      </Modal>
    );
  }
}

ActivityPointsEditDialog = reduxForm({
  form: 'ActivityPointsEditDialog',
})(ActivityPointsEditDialog);

export default connect(() => ({
}), studentsActions)(ActivityPointsEditDialog);
