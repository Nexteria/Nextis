import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';


export default class FeedbackButton extends Component {

  static propTypes = {
    publicFeedbackLink: PropTypes.string.isRequired,
  }

  render() {
    const { publicFeedbackLink } = this.props;
    return (
      <a
        className="btn btn-info btn-xs"
        target="_blank"
        href={publicFeedbackLink}
      >
      Vyplniť feedback
      </a>
    );
  }
}
