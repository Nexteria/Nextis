import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import Modal, { Body } from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';


import './GuideProfile.scss';


export class GuideProfilePageDialog extends Component {

  static propTypes = {
    guides: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  render() {
    const {
      guides,
      fields,
      params,
    } = this.props;

    const guide = guides.get(parseInt(params.guideId, 10));

    if (!guide) {
      return null;
    }

    const sections = [
      'fields_where_want_to_help',
      'cv_highlights',
      'my_activities',
      'type_of_work_with_student',
      'links_about_me',
      'what_student_should_know',
    ];

    const sectionsData = {};
    sections.forEach(section => {
      const field = fields.filter(field => field.get('codename') === section).first();
      sectionsData[section] = {
        title: field.get('name'),
        data: guide.get('fields').filter(gField =>
          gField.get('fieldTypeId') === field.get('id')).first()
          .get('value'),
      };
    });

    return (
      <Modal
        show
        bsSize="large"
        onHide={() => browserHistory.goBack()}
        className="guides-container"
      >
        <Body>
          <div className="page">
            <div className="guide-left-column">
              {guide.get('profile_picture') ?
                <img
                  className="guide-profile-picture"
                  src={guide.get('profile_picture').filePath}
                  alt={`${guide.get('firstName')} ${guide.get('lastName')}`}
                />
                : null
              }
              <div className="guide-name">
                <div>{guide.get('lastName')}</div>
                <div>{guide.get('firstName')}</div>
              </div>

              <div className="guide-occupation">
                {guide.get('currentOccupation')}
              </div>
              <div className="guide-linkedin">
                <a href={guide.get('linkedInUrl')} target="_blank">LinkedIn</a>
              </div>

              <div className="guide-section-one">
                <div className="guide-section-title">
                  {sectionsData.fields_where_want_to_help.title}
                </div>
                <div
                  className="guide-section-data"
                  dangerouslySetInnerHTML={{ __html: sectionsData.fields_where_want_to_help.data }}
                >
                </div>
              </div>
              <div className="nx-logo">
                <img src="/img/nexteria-logo-img.png" alt="Logo" />
                Nexteria
              </div>
            </div>
            <div className="guide-right-column">
              <div className="guide-section-title top-section-one">CV HIGHLIGHTS</div>
              <div className="guide-section-two">
                <div className="guide-section-title">
                  {sectionsData.cv_highlights.title}
                </div>
                <div
                  className="guide-section-data"
                  dangerouslySetInnerHTML={{ __html: sectionsData.cv_highlights.data }}
                >
                </div>
              </div>

              <div className="guide-section-title top-section-two">VIAC O MNE</div>
              <div className="guide-section-three">
                <div className="guide-section-title">
                  {sectionsData.my_activities.title}
                </div>
                <div
                  className="guide-section-data"
                  dangerouslySetInnerHTML={{ __html: sectionsData.my_activities.data }}
                >
                </div>
              </div>
              <div className="guide-section-four">
                <div className="guide-section-title">
                  {sectionsData.type_of_work_with_student.title}
                </div>
                <div
                  className="guide-section-data"
                  dangerouslySetInnerHTML={{ __html: sectionsData.type_of_work_with_student.data }}
                >
                </div>
              </div>
              <div className="guide-section-five">
                <div className="guide-section-title">
                  {sectionsData.links_about_me.title}
                </div>
                <div
                  className="guide-section-data"
                  dangerouslySetInnerHTML={{ __html: sectionsData.links_about_me.data }}
                >
                </div>
              </div>
              <div className="guide-section-six">
                <div className="guide-section-title">
                  {sectionsData.what_student_should_know.title}
                </div>
                <div
                  className="guide-section-data"
                  dangerouslySetInnerHTML={{ __html: sectionsData.what_student_should_know.data }}
                >
                </div>
              </div>
            </div>
          </div>
        </Body>
      </Modal>
    );
  }
}

export default connect(state => ({
  guides: state.guides.guides,
  fields: state.guides.fields,
}))(GuideProfilePageDialog);
