import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import diacritics from 'diacritics';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { fields } from '../../../common/lib/redux-fields/index';
import * as actions from '../../../common/semesters/actions';

const messages = defineMessages({
  title: {
    defaultMessage: 'Semesters',
    id: 'semesters.manage.title'
  },
  tableTitle: {
    defaultMessage: 'Users - managment',
    id: 'users.manage.table.title'
  },
  noUsers: {
    defaultMessage: 'No users here',
    id: 'users.manage.noUsers'
  },
  firstName: {
    defaultMessage: 'First name',
    id: 'users.manage.firstName'
  },
  lastName: {
    defaultMessage: 'Last name',
    id: 'users.manage.lastName'
  },
  actions: {
    defaultMessage: 'Actions',
    id: 'users.manage.actions'
  },
  points: {
    defaultMessage: 'Activity points',
    id: 'users.manage.points'
  },
  userBaseSemesterActivityPoints: {
    defaultMessage: 'Students base activity points',
    id: 'users.manage.userBaseSemesterActivityPoints'
  },
  sortBy: {
    defaultMessage: 'Sort by',
    id: 'users.manage.sortBy'
  },
  all: {
    defaultMessage: 'All',
    id: 'users.manage.all'
  },
});

class SemestersPage extends Component {

  static propTypes = {
    semesters: PropTypes.object,
    fields: PropTypes.object.isRequired,
    fetchAdminSemesters: PropTypes.func.isRequired,
    hasPermission: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { fetchAdminSemesters } = this.props;
    fetchAdminSemesters();
  }

  render() {
    const { semesters, hasPermission } = this.props;
    const { formatMessage } = this.props.intl;

    const semestersData = semesters.map(semester => {
      return {
        id: semester.get('id'),
        name: semester.get('name'),
        startDate: format(parse(semester.get('startDate')), 'D.M.YYYY'),
        endDate: format(parse(semester.get('endDate')), 'D.M.YYYY'),
        events: semester.get('events').length,
        activeStudents: semester.get('activeStudents').length,
      };
    });

    return (
      <div className="group-managment-page">
        <section className="content-header">
          <h1>
            <FormattedMessage {...messages.title} />
            {hasPermission('create_users') ?
              <i
                className="fa fa-plus text-green"
                style={{ cursor: 'pointer', marginLeft: '2em' }}
                onClick={() => browserHistory.push('/admin/users/create')}
              ></i>
             : ''
            }
          </h1>
        </section>
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <div className="box-body table-responsive no-padding items-container">
                  <BootstrapTable
                    data={semestersData}
                    multiColumnSort={3}
                    striped
                    hover
                  >
                    <TableHeaderColumn isKey hidden dataField="id" />

                    <TableHeaderColumn dataField="name" dataSort>
                      Názov
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="startDate" dataSort dataFormat={x => x}>
                      Začiatok
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="endDate" dataSort dataFormat={x => x}>
                      Koniec
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="events" dataSort>
                      Počet publikovaných eventov
                    </TableHeaderColumn>

                    <TableHeaderColumn dataField="activeStudents" dataSort>
                      Počet aktívnych študentov
                    </TableHeaderColumn>
                  </BootstrapTable>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

SemestersPage = fields(SemestersPage, {
  path: 'semesters',
  fields: [
    'filter',
  ],
});

SemestersPage = injectIntl(SemestersPage);

export default connect(state => ({
  semesters: state.semesters.getIn(['admin', 'semesters']),
  hasPermission: (permission) => state.users.hasPermission(permission, state),
}), actions)(SemestersPage);
