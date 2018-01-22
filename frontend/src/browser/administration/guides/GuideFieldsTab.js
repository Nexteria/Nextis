import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { browserHistory } from 'react-router';

import * as actions from '../../../common/guides/actions';
import { sortProfileProgress } from './GuidesListTab';

class GuideFieldsTab extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    guides: PropTypes.object.isRequired,
    removeGuideField: PropTypes.func.isRequired,
  };

  render() {
    const { guides, fields, removeGuideField } = this.props;

    const data = guides.valueSeq().map(guide => {
      const guideData = {
        name: `${guide.get('firstName')} ${guide.get('lastName')}`,
        profileProgress: 0,
        id: guide.get('id'),
      };

      let fieldsNeedsUpdate = 0;

      fields.forEach(field => {
        const codename = field.get('codename');
        const gField = guide.get('fields').filter(guideField =>
          guideField.get('fieldTypeId') === field.get('id')
        ).first();

        if (!gField || gField.get('needUpdates')) {
          fieldsNeedsUpdate++;
          guideData[codename] = <div style={{ backgroundColor: 'red' }}>&nbsp;</div>;
        } else {
          guideData[codename] = <div style={{ backgroundColor: 'green' }}>&nbsp;</div>;
        }
      });

      guideData.profileProgress =
        Math.floor((100 - (fieldsNeedsUpdate / fields.size * 100)) * 100) / 100;

      if (!fields.size) {
        guideData.profileProgress = 100;
      }

      let badgeColor = 'green';
      if (guideData.profileProgress < 75) {
        badgeColor = 'yellow';
      }

      if (guideData.profileProgress < 25) {
        badgeColor = 'red';
      }

      guideData.profileProgressBadge = (
        <span className={`badge bg-${badgeColor}`}>{guideData.profileProgress}%</span>
      );

      return guideData;
    });

    let tableFields = fields;
    tableFields = tableFields.set('name', new Map({
      codename: 'name',
      name: 'Guide',
      fake: true,
      order: -1000,
    }));
    tableFields = tableFields.set('profileProgress', new Map({
      codename: 'profileProgressBadge',
      name: 'Vyplnený profil',
      fake: true,
      order: 1000,
      sortable: true,
      sortFunc: sortProfileProgress,
    }));

    return (
      <div className="text-center">
        <BootstrapTable
          data={data.toArray()}
          striped
          keyField={'id'}
          hover
        >
          {tableFields.sort((a, b) => a.get('order') - b.get('order')).valueSeq().map(field =>
            <TableHeaderColumn
              key={field.get('codename')}
              thStyle={{ whiteSpace: 'normal', textOverflow: 'unset' }}
              dataField={field.get('codename')}
              dataFormat={x => x}
              dataSort={field.get('sortable')}
              sortFunc={sortProfileProgress}
            >
              {field.get('fake') ?
                <div className="text-center">{field.get('name')}</div>
                :
                <div className="text-center">
                  <div>
                    <button
                      onClick={() => removeGuideField(field.get('id'))}
                      className="btn btn-xs btn-danger"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                    <button
                      style={{ marginLeft: '1em' }}
                      onClick={() => browserHistory.push(`/admin/guides/fields/${field.get('id')}`)}
                      className="btn btn-xs btn-info"
                    >
                      <i className="fa fa-pencil"></i>
                    </button>
                  </div>
                  <div>{field.get('name')}</div>
                </div>
              }
            </TableHeaderColumn>
          )}
        </BootstrapTable>
        <button
          className="btn btn-success"
          onClick={() => browserHistory.push('/admin/guides/fields/add')}
        >Pridať nový typ údajov</button>
      </div>
    );
  }
}

export default connect(state => ({
  guides: state.guides.guides,
  fields: state.guides.fields,
}), { ...actions })(GuideFieldsTab);
