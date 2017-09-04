import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';


const styles = {
  signInTermLabel: {
    fontSize: '0.8em',
  }
};

export default class EventTerms extends Component {

  static propTypes = {
    event: PropTypes.object.isRequired,
  }

  render() {
    const {
      event,
    } = this.props;

    return (
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
            {event.getIn(['terms', 'streams']).valueSeq().map((v, index) =>
              <th style={{ textAlign: 'center' }}>
                <span>Termín #{index + 1}</span>
                <span> ({`${v.get('signedInAttendeesCount')}/${v.get('maxCapacity')}`})</span>
              </th>
            )}
            </tr>
          </thead>
          <tbody style={{ textAlign: 'center' }}>
            <tr>
              {event.getIn(['terms', 'streams']).map(stream =>
                <td>
                  <div>
                    <span
                      className="label label-success"
                      style={styles.signInTermLabel}
                    >
                      <FormattedDate value={stream.get('eventStartDateTime')} />
                      <span> o </span>
                      <FormattedTime value={stream.get('eventStartDateTime')} />
                      <span> - </span>
                      <FormattedDate value={stream.get('eventEndDateTime')} />
                      <span> o </span>
                      <FormattedTime value={stream.get('eventEndDateTime')} />
                    </span>
                  </div>
                  {stream.get('terms').valueSeq().map(term =>
                    <span
                      className="label label-success"
                      style={styles.signInTermLabel}
                    >
                      <FormattedDate value={term.get('eventStartDateTime')} />
                      <span> o </span>
                      <FormattedTime value={term.get('eventStartDateTime')} />
                      <span> - </span>
                      <FormattedDate value={term.get('eventEndDateTime')} />
                      <span> o </span>
                      <FormattedTime value={term.get('eventEndDateTime')} />
                    </span>
                  )}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
