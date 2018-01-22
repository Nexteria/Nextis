import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

import * as actions from '../../../common/guides/actions';
import GuideFieldsTab from './GuideFieldsTab';
import GuidesListTab from './GuidesListTab';
import ImportGuidesTab from './ImportGuidesTab';

class GuidesPage extends Component {

  static propTypes = {
    fetchGuidesList: PropTypes.func.isRequired,
    fetchGuidesFields: PropTypes.func.isRequired,
    children: PropTypes.object,
  };

  componentDidMount() {
    const { fetchGuidesList, fetchGuidesFields } = this.props;
    fetchGuidesList();
    fetchGuidesFields();
  }

  render() {
    const { children } = this.props;

    return (
      <div style={{ margin: '0em 1em' }}>
        <section className="content-header">
          <h1>
            Guidi
          </h1>
        </section>
        <section className="content">
          <Tabs
            id="admin-guides-tabs"
            defaultActiveKey={'guides-list-tab'}
            className="nav-tabs-custom"
            mountOnEnter
          >
            <Tab
              eventKey={'guides-list-tab'}
              title="Guidi"
            >
              <GuidesListTab />
            </Tab>
            <Tab
              eventKey={'guides-fields-tab'}
              title="Údaje o Guidoch"
            >
              <GuideFieldsTab />
            </Tab>
            <Tab
              eventKey={'import-guides-tab'}
              title="Import guidov"
            >
              <ImportGuidesTab />
            </Tab>
          </Tabs>
        </section>
        {children}
      </div>
    );
  }
}

GuidesPage = reduxForm({
  form: 'GuidesPage',
})(GuidesPage);

export default connect(state => ({
  guides: state.guides.guides,
  fields: state.guides.fields,
}), { ...actions })(GuidesPage);
