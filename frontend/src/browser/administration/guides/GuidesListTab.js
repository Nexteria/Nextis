import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { browserHistory } from 'react-router';

import * as actions from '../../../common/guides/actions';

export function sortProfileProgress(a, b, order) {   // order is desc or asc
  if (order === 'desc') {
    return a.profileProgress - b.profileProgress;
  }

  return b.profileProgress - a.profileProgress;
}

class GuidesListTab extends Component {
  static propTypes = {
    guides: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
  };

  render() {
    const { guides, fields } = this.props;

    const data = guides.valueSeq().map(guide => {
      const guideData = {
        firstName: guide.get('firstName'),
        lastName: guide.get('lastName'),
        linkedInUrl: guide.get('linkedInUrl'),
        email: guide.get('email'),
        currentOccupation: guide.get('currentOccupation'),
        profileProgress: 0,
        id: guide.get('id'),
      };

      let fieldsNeedsUpdate = 0;

      fields.forEach(field => {
        const gField = guide.get('fields').filter(guideField =>
          guideField.get('fieldTypeId') === field.get('id')
        ).first();

        if (!gField || gField.get('needUpdates')) {
          fieldsNeedsUpdate++;
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

      guideData.actions = (
        <span className="action-buttons">
          <i
            className="fa fa-pencil"
            onClick={() => browserHistory.push(`/admin/guides/${guide.get('id')}`)}
          ></i>

          <i
            className="fa fa-file-text-o"
            onClick={() =>
              browserHistory.push(`/admin/guides/${guide.get('id')}/profile`)
            }
          ></i>
        </span>
      );

      return guideData;
    });

    return (
      <div className="text-center">
        <BootstrapTable
          data={data.toArray()}
          striped
          search
          hover
        >
          <TableHeaderColumn isKey hidden dataField="id" />

          <TableHeaderColumn
            dataField="firstName"
            dataSort
          >
              Meno
          </TableHeaderColumn>

          <TableHeaderColumn
            dataField="lastName"
            dataSort
          >
              Priezvisko
          </TableHeaderColumn>

          <TableHeaderColumn
            dataField="email"
            dataSort
            tdStyle={{ whiteSpace: 'normal', textOverflow: 'unset' }}
          >
              Email
          </TableHeaderColumn>

          <TableHeaderColumn
            dataField="linkedInUrl"
            tdStyle={{ whiteSpace: 'normal', textOverflow: 'unset' }}
          >
              LinkedIn
          </TableHeaderColumn>

          <TableHeaderColumn
            dataField="profileProgressBadge"
            dataFormat={x => x}
            sortFunc={sortProfileProgress}
            dataSort
          >
              Vyplnený profil
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="actions"
            dataFormat={x => x}
          >
              Akcie
          </TableHeaderColumn>
        </BootstrapTable>
        <button
          className="btn btn-success"
          onClick={() => browserHistory.push('/admin/guides/add')}
        >Pridať nového guida</button>
      </div>
    );
  }
}

export default connect(state => ({
  guides: state.guides.guides,
  fields: state.guides.fields,
}), { ...actions })(GuidesListTab);
