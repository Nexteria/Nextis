import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../common/students/actions';
import * as guidesActions from '../../common/guides/actions';
import GuideOption from './GuideOption';
import { GuideProfilePageDialog } from '../administration/guides/GuideProfilePageDialog';
import GuideProfilePage from '../administration/guides/GuideProfilePage';

class GuidesPage extends Component {

  static propTypes = {
    student: PropTypes.object.isRequired,
    children: PropTypes.object,
    fields: PropTypes.object,
    guides: PropTypes.object,
    fetchGuidesFields: PropTypes.func.isRequired,
    fetchGuidesList: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchGuidesList, fetchGuidesFields } = this.props;
    fetchGuidesList();
    fetchGuidesFields();
  }

  render() {
    const { student, children, fields, guides } = this.props;

    if (!guides || (student.get('guideId') && !guides.get(student.get('guideId')))) {
      return <div />;
    }

    return (
      <div>
        <section className="content-header text-center">
          <h1>
            {student.get('guideId') ?
              'Tvoj Guide'
              :
              'Výber Guida'
            }
          </h1>
        </section>
        <section className="content">
          {student.get('guideId') ?
            <GuideProfilePage guide={guides.get(student.get('guideId'))} fields={fields} />
            :
            student.get('guidesOptions').map(option =>
              <GuideOption option={option} form={`guide-option-${option.id}`} />
            )
          }
        </section>
        {children}
      </div>
    );
  }
}

export default connect(state => ({
  viewer: state.users.viewer,
  student: state.users.viewerRolesData.get('student'),
  guides: state.guides.guides,
  fields: state.guides.fields,
}), { ...actions, ...guidesActions })(GuidesPage);
