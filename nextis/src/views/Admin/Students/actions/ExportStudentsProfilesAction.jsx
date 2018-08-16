import React from 'react';
import request from 'common/fetch';
import download from 'downloadjs';

import ItemGrid from 'components/Grid/ItemGrid';
import GridContainer from 'components/Grid/GridContainer';
import Button from 'components/CustomButtons/Button';

class ExportStudentsProfilesAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.handleExportStudentsProfiles = this.handleExportStudentsProfiles.bind(this);
  }

  async handleExportStudentsProfiles() {
    const { selectedStudents } = this.props;

    this.setState({ loading: true });

    await request('/api/admin/students/profile', {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      notifications: 'both',
      body: JSON.stringify({
        studentIds: Object.keys(selectedStudents),
      }),
    }).then(response => response.blob())
      .then(blob => download(blob, 'ExportStudentskychProfilov.xls'));

    this.setState({ loading: false });
  }

  render() {
    const {
      selectedStudents,
    } = this.props;

    const { loading } = this.state;

    return (
      <GridContainer>
        <ItemGrid xs={12} container justify="center">
          <Button
            size="xs"
            color="success"
            onClick={this.handleExportStudentsProfiles}
            disabled={!selectedStudents || !Object.keys(selectedStudents).length || loading}
          >
            {`Export ${selectedStudents ? Object.keys(selectedStudents).length : 0} vybraných študentov`}
          </Button>
        </ItemGrid>
      </GridContainer>
    );
  }
}

export default ExportStudentsProfilesAction;
