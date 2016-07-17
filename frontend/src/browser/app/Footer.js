import Component from 'react-pure-render/component';
import React from 'react';

export default class Footer extends Component {

  render() {
    return (
      <footer className="main-footer">
        <div className="pull-right hidden-xs">
          <b>Version</b> 0.1.0
        </div>
        Copyright &copy; 2016-2017 <strong>Nexteria</strong> All rights
        reserved.
      </footer>
    );
  }
}
