import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import 'react-image-crop/dist/ReactCrop.css';

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
  resizerImageStyle: {
    height: '200px',
  },
  resizerStyle: {
    margin: 'auto',
  },
};

export default class Dialog extends Component {

  state = {
    crop: {
      x: 0,
      y: 0,
      aspect: 1,
    },
  }

  onImageLoaded = (image, input, file) => {
    const crop = {
      aspect: 1,
    };

    if (image.naturalWidth > image.naturalHeight) {
      crop.height = 100;
      crop.x = (100 - (image.naturalHeight / image.naturalWidth * 100)) / 2;
      crop.y = 0;
      crop.width = (image.naturalHeight / image.naturalWidth * 100);
    } else {
      crop.width = 100;
      crop.height = (image.naturalWidth / image.naturalHeight * 100);
      crop.y = (100 - (image.naturalWidth / image.naturalHeight * 100)) / 2;
      crop.x = 0;
    }

    this.setState({
      crop: makeAspectCrop(crop, image.naturalWidth / image.naturalHeight),
      image,
    });

    const pixelCrop = {
      x: Math.round(image.naturalWidth * (crop.x / 100)),
      y: Math.round(image.naturalHeight * (crop.y / 100)),
      width: Math.round(image.naturalWidth * (crop.width / 100)),
      height: Math.round(image.naturalHeight * (crop.height / 100)),
    };

    file.pixelCrop = pixelCrop;
    input.onChange([file]);
  }

  render() {
    const { input, accept, multiple, cropEnabled, label, meta: { touched, error } } = this.props;

    return (
      <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
        <div className="col-sm-12">
          {!input.value ?
            <Dropzone
              multiple={multiple}
              accept={accept}
              cropEnabled={cropEnabled}
              onDrop={(files) => input.onChange(files)}
              style={styles.dropzoneArea}
            >
              <div style={styles.dropzoneInner}>
                {!input.value ?
                  <span>{label}</span>
                  : null
                }
              </div>
            </Dropzone>
                :
                input.value.map(file =>
                  <div className="text-center">
                    <ReactCrop
                      {...this.state}
                      keepSelection
                      src={file.preview}
                      onImageLoaded={(image) => this.onImageLoaded(image, input, file)}
                      onComplete={() => null}
                      onChange={(crop, pixelCrop) => {
                        file.pixelCrop = pixelCrop;
                        input.onChange([file]);
                        this.setState({ crop });
                      }}
                      imageStyle={styles.resizerImageStyle}
                      style={styles.resizerStyle}
                    />
                  </div>
                )
              }
          <div className="has-error">
            {touched && error && <label>{error}</label>}
          </div>
        </div>
      </div>
    );
  }
}
