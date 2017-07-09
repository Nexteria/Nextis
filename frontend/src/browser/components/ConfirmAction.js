import React from 'react';
import ReactDOM from 'react-dom';
import toastr from 'toastr';

export default function confirmAction(text, yesAction, noAction) {
  const oldOptions = toastr.options;

  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    showDuration: '300',
    hideDuration: '2000',
    timeOut: '8000',
    extendedTimeOut: '5000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
  };

  const toastrContent = document.createElement('div');

  ReactDOM.render(
    <div>
      <p>{text}</p>
      <button
        type="button"
        id="yes-confirmation-button"
        onClick={yesAction}
        className="btn btn-success"
      >
        Áno
      </button>
      <button
        type="button"
        id="no-confirmation-button"
        onClick={noAction}
        className="btn btn-danger"
        style={{ margin: '0 8px 0 8px' }}
      >
        Nie
      </button>
    </div>,
    toastrContent
  );

  toastr.info(toastrContent);

  toastr.options = oldOptions;
}
