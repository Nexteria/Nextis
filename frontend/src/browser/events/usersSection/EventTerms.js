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
    selectedTermId: PropTypes.number,
  }

  render() {
    const {
      event,
      selectedTermId,
    } = this.props;

    const numberOfTerms = event.getIn(['terms', 'streams']).size;

    return (
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
            {event.getIn(['terms', 'streams']).valueSeq().map((v, index) =>
              <th
                style={{
                  textAlign: 'center',
                  backgroundColor: selectedTermId === v.get('id') ? '#2196f32b' : 'transparent'
                }}
              >
                {numberOfTerms === 1 ?
                  <span>Termín</span>
                  :
                  <span>Alternatíva #{index + 1}</span>
                }
                <span> ({`${v.get('signedInAttendeesCount')}/${v.get('maxCapacity')}`})</span>
              </th>
            )}
            </tr>
          </thead>
          <tbody style={{ textAlign: 'center' }}>
            <tr>
              {event.getIn(['terms', 'streams']).map(stream =>
                <td
                  style={{
                    backgroundColor: selectedTermId === stream.get('id') ? '#2196f32b' : 'transparent'
                  }}
                >
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
