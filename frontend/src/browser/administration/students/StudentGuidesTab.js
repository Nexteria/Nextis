import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Map } from 'immutable';
import confirmAction from '../../components/ConfirmAction';


import TagsComponent from '../../components/TagPicker';
import * as actions from '../../../common/students/actions';
import * as guideActions from '../../../common/guides/actions';

const styles = {
  rowTd: {
    whiteSpace: 'normal',
    textOverflow: 'unset',
  },
  choosenGuide: {
    marginTop: '2em',
  },
};


class StudentGuidesTab extends Component {

  static propTypes = {
    guides: PropTypes.object,
    fetchGuidesList: PropTypes.func.isRequired,
    addStudentsGuideOption: PropTypes.func.isRequired,
    removeStudentsGuideOption: PropTypes.func.isRequired,
    assignGuideToStudent: PropTypes.func.isRequired,
    student: PropTypes.object.isRequired,
    removeStudentsGuideConnection: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { fetchGuidesList } = this.props;
    fetchGuidesList();
  }

  render() {
    const {
      guides,
      addStudentsGuideOption,
      removeStudentsGuideOption,
      assignGuideToStudent,
      removeStudentsGuideConnection,
      student,
    } = this.props;

    if (!guides) {
      return <div />;
    }

    const data = student.get('guidesOptions').map(guideData => ({
      firstName: guideData.get('firstName'),
      lastName: guideData.get('firstName'),
      ...guideData.get('pivot'),
      actions: (
        <div>
          <button
            onClick={() => confirmAction(
              'Ste si istý, že chcete zmazať túto možnosť?',
              () => removeStudentsGuideOption(student.get('id'), guideData.get('pivot').id),
              null
            )}
            className="btn btn-xs btn-danger"
          >
            <i className="fa fa-trash"></i>
          </button>
          <button
            style={{ marginLeft: '1em' }}
            onClick={() => confirmAction(
              'Ste si istý, že chcete študentovi priradiť tohto guida?',
              () => confirmAction(
                'Má sa študentovi odoslať emailová notifikácia o priradení? Je profil guida v poriadku s fotkou?',
                () => assignGuideToStudent(student.get('id'), guideData.get('id'), true),
                () => assignGuideToStudent(student.get('id'), guideData.get('id'), false)
              ),
              null
            )}
            className="btn btn-xs btn-success"
          >
            Priradiť
          </button>
        </div>
      )
    })).toArray();

    const guide = guides.get(student.get('guideId'));

    return (
      <div>
        <div className="col-md-12">
          <TagsComponent
            label="Pridať guida:"
            suggestionsMapFunc={guide => `${guide.get('firstName')} ${guide.get('lastName')}`}
            tagsData={guides}
            maxTags={1}
            input={{
              value: new Map(),
              handleAddition: (guide) => addStudentsGuideOption(guide, student.get('id')),
              onChange: () => {}
            }}
            meta={{ asyncValidating: false, touched: false, error: false }}
          />
        </div>
        <div>
          <BootstrapTable
            data={data}
            striped
            hover
          >
            <TableHeaderColumn isKey hidden dataField="id" />

            <TableHeaderColumn
              dataField="priority"
              dataSort
              width="6.5em"
              thStyle={styles.rowTd}
            >
                Priorita
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField="firstName"
            >
                Meno
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField="lastName"
            >
                Priezvisko
            </TableHeaderColumn>

            <TableHeaderColumn
              tdStyle={styles.rowTd}
              thStyle={styles.rowTd}
              dataField="whyIWouldChooseThisGuide"
            >
                Prečo by som si vybral tohto guida/ku?
            </TableHeaderColumn>

            <TableHeaderColumn
              thStyle={styles.rowTd}
              tdStyle={styles.rowTd}
              dataField="whyIWouldChooseThisGuide"
            >
                Ako môžem guidovi pomôcť?
            </TableHeaderColumn>
            <TableHeaderColumn
              thStyle={styles.rowTd}
              tdStyle={styles.rowTd}
              dataField="actions"
              dataFormat={x => x}
            >
                Akcie
            </TableHeaderColumn>
          </BootstrapTable>
        </div>
        <div className="col-md-12" style={styles.choosenGuide}>
          <label>Priradený guide:</label>
          {guide ?
            <div>
              <div>
                <span>{`${guide.get('firstName')} ${guide.get('lastName')}`} </span>
                <button
                  onClick={() => confirmAction(
                    'Ste si istý, že chcete zrušiť toto priradenie?',
                    () => removeStudentsGuideConnection(student.get('id')),
                    null
                  )}
                  className="btn btn-xs btn-danger"
                >
                  Zrušiť priradenie
                </button>
              </div>
            </div>
            : null
          }
        </div>
        <div className="clearfix" />
      </div>
    );
  }
}

export default connect((state) => ({
  guides: state.guides.get('guides'),
}), { ...actions, ...guideActions })(StudentGuidesTab);
