import React from 'react';

import withStyles from 'material-ui/styles/withStyles';
import { compose } from 'recompose';

import MenuItem from 'material-ui/Menu/MenuItem';
import FormControl from 'material-ui/Form/FormControl';
import Select from 'material-ui/Select';
import RegularCard from 'components/Cards/RegularCard';

/* import AssignNewSemesterAction from 'views/Admin/Students/actions/AssignNewSemesterAction';
import EndSchoolYearAction from 'views/Admin/Students/actions/EndSchoolYearAction';
import ImportNewStudentsAction from 'views/Admin/Students/actions/ImportNewStudentsAction';
import ChangeStudentLevelAction from 'views/Admin/Students/actions/ChangeStudentLevelAction';
import ChangeTuitionFeeAction from 'views/Admin/Students/actions/ChangeTuitionFeeAction';
import AddNoteAction from 'views/Admin/Students/actions/AddNoteAction';
import ChangeActivityPointsAction from 'views/Admin/Students/actions/ChangeActivityPointsAction';
import DownloadReportAction from 'views/Admin/Students/actions/DownloadReportAction';
import ChangeStudentStatusAction from 'views/Admin/Students/actions/ChangeStudentStatusAction'; */
// import AddActivityPoints from 'views/Admin/Students/actions/AddActivityPoints';
import ExportStudentsProfilesAction from 'views/Admin/Students/actions/ExportStudentsProfilesAction';

const styles = {
  actionButton: {
    margin: '0 0 0 5px',
    padding: '5px'
  },
  actionButtonRound: {
    width: 'auto',
    height: 'auto',
    minWidth: 'auto'
  },
  icon: {
    verticalAlign: 'middle',
    width: '17px',
    height: '17px',
    top: '-1px',
    position: 'relative'
  },
  icons: {
    width: '17px',
    height: '17px',
    marginRight: '5px',
  },
};

class StudentsActionsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'no_action',
    };
  }

  render() {
    const { selectedStudents, classes } = this.props;
    const { action } = this.state;

    const actionMap = {
      no_action: {
        component: () => <div />,
        label: 'Zvoľte akciu',
      },
      /* add_activity_points: {
        component: () => <AddActivityPoints {...{ selectedStudents }} />,
        label: 'Pridať aktivity body',
      }, */
      /* assign_new_semester: {
        component: () => <AssignNewSemesterAction {...{ selectedStudents }} />,
        label: 'Priradiť nový semester',
      },
      end_school_year: {
        component: () => <EndSchoolYearAction {...{ selectedStudents }} />,
        label: 'Ukončiť školský rok',
      },
      import_new_students: {
        component: () => <ImportNewStudentsAction {...{ selectedStudents }} />,
        label: 'Nahrať nových študentov',
      },
      change_student_level: {
        component: () => <ChangeStudentLevelAction {...{ selectedStudents }} />,
        label: 'Zmena levelu študenta',
      },
      add_student_note: {
        component: () => <AddNoteAction {...{ selectedStudents }} />,
        label: 'Pridať študentom poznámku',
      },
      change_tuition_fee: {
        component: () => <ChangeTuitionFeeAction {...{ selectedStudents }} />,
        label: 'Zmena výšky školného',
      },
      change_activity_point: {
        component: () => <ChangeActivityPointsAction {...{ selectedStudents }} />,
        label: 'Zmena základu aktivity bodov',
      },
      download_students_reports: {
        component: () => <DownloadReportAction {...{ selectedStudents }} />,
        label: 'Stiahnuť reporty',
      },
      change_student_status: {
        component: () => <ChangeStudentStatusAction {...{ selectedStudents }} />,
        label: 'Zmeniť status študenta',
      }, */
      export_students_profiles: {
        component: () => <ExportStudentsProfilesAction {...{ selectedStudents }} />,
        label: 'Export študentských profilov',
      },
    };

    return (
      <div className="students-actions-panel">
        <h3 className="box-title">
          {'Akcie nad študentami'}
        </h3>
        <FormControl
          fullWidth
          className={classes.selectFormControl}
        >
          <Select
            MenuProps={{
              className: classes.selectMenu
            }}
            classes={{
              select: classes.select
            }}
            value={action}
            onChange={event => this.setState({ action: event.target.value })}
            inputProps={{
              name: 'action',
              id: 'action',
            }}
          >
            <MenuItem
              disabled
              classes={{
                root: classes.selectMenuItem
              }}
            >
              {'Vyber hodnotu'}
            </MenuItem>
            {Object.keys(actionMap).map(key => (
              <MenuItem
                key={key}
                classes={{
                  root: classes.selectMenuItem,
                  selected: classes.selectMenuItemSelected
                }}
                value={key}
              >
                {actionMap[key].label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <RegularCard
          content={(
            <div className="box-body no-padding">
              {actionMap[action] && actionMap[action].component()}
              <div className="clearfix" />
            </div>
          )}
        />
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
)(StudentsActionsContainer);
