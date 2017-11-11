import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';


const styles = {
  signInTermLabel: {
    fontSize: '0.8em',
  },
  alternativesContainer: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  alternativeHeader: {
    fontWeight: 'bold',
  },
  termContainer: {
    margin: '0.5em',
  },
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
      <div style={styles.alternativesContainer}>
        {event.getIn(['terms', 'streams']).valueSeq().map((stream, index) =>
          <div
            key={index}
            style={{
              textAlign: 'center',
              margin: '1em',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              backgroundColor: selectedTermId === stream.get('id') ? '#2196f32b' : 'transparent'
            }}
          >
            <div style={styles.alternativeHeader}>
              {numberOfTerms === 1 ?
                <span>Termín</span>
                :
                <span>Alternatíva #{index + 1}</span>
              }
              <span> ({`${stream.get('signedInAttendeesCount')}/${stream.get('maxCapacity')}`})</span>
            </div>
            <div style={styles.termContainer}>
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
              <div key={term.get('id')} style={styles.termContainer}>
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
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
