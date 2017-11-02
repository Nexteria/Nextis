import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';


const styles = {
  labelsContainer: {
    position: 'absolute',
    right: '0px',
    top: '-1em',
    fontSize: '1.5em',
  },
  eventCategoryLabel: {
    borderRadius: '0px',
  },
  multiTermEventLabel: {
    backgroundColor: '#00a65a',
  },
  multiMeetingEventLabel: {
    backgroundColor: '#f39c12',
  },
};

export default class MultiMeetingTerms extends Component {

  static propTypes = {
    isMultiMeeting: PropTypes.bool.isRequired,
    isMultiTerm: PropTypes.bool.isRequired,
  }

  render() {
    const {
      isMultiMeeting,
      isMultiTerm,
    } = this.props;

    return (
      <div style={styles.labelsContainer}>
        {isMultiTerm &&
          <span
            style={{ ...styles.eventCategoryLabel, ...styles.multiTermEventLabel }}
            className="label"
          >Vyber si termín</span>
        }
        {isMultiMeeting &&
          <span
            style={{ ...styles.eventCategoryLabel, ...styles.multiMeetingEventLabel }}
            className="label"
          >Viacdielny</span>
        }
      </div>
    );
  }
}
