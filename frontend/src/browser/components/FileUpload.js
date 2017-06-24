import React from 'react';
import Dropzone from 'react-dropzone';

const styles = {
  dropzoneArea: {
    margin: 'auto',
    marginTop: '1em',
    width: '200px',
    height: '200px',
    borderWidth: '2px',
    borderColor: 'rgb(102, 102, 102)',
    borderStyle: 'dashed',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    cursor: 'pointer',
  },
  dropzoneInner: {
    margin: 'auto',
  },
};

export default function renderDate(data) {
  const { input, accept, multiple, label, meta: { touched, error } } = data;

  return (
    <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
      <div className="col-sm-12">
        <Dropzone
          multiple={multiple}
          accept={accept}
          onDrop={(files) => input.onChange(files)}
          style={styles.dropzoneArea}
        >
          <div style={styles.dropzoneInner}>
            {!input.value ? 
              <span>{label}</span>
              :
              input.value.map(file => {
                return (
                  <div>{file.name}</div>
                );
              })
            }
          </div>
        </Dropzone>
        <div className="has-error">
          {touched && error && <label>{error}</label>}
        </div>
      </div>
    </div>
  );
}
