import React from "react";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import { connect } from "common/store";
import Spinner from 'react-spinkit';

import IconButton from "components/CustomButtons/IconButton.jsx";
import Button from "components/CustomButtons/Button.jsx";

import avatarImg from "assets/img/default-avatar.png";

import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";

export class ProfileAvatarForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      uploading: false,
      imagePreviewUrl: this.props.photoUrl ? this.props.photoUrl : avatarImg
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    if (file.size / 1024 > 1500) {
      this.props.actions.setNotification({
        id: 'updateProfilePhoto',
        place: 'tr',
        color: 'danger',
        message: 'Maximálna povolená veľkosť fotky je 1.5 MB. Skúste znova!'
      });

      return;
    }

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  handleSubmit() {
    this.setState({ uploading: true });
    this.props.updatePhoto({ variables: { profilePicture: this.state.file }}).then(() => {
      this.setState({ uploading: false, file: null });
      this.props.actions.setNotification({id: 'updateProfilePhoto', place: 'tr', color: 'success', message: 'Fotka bola aktualizovaná'});
    }).catch(() => {
      this.setState({ uploading: false });
      this.props.actions.setNotification({id: 'updateProfilePhoto', place: 'tr', color: 'danger', message: 'Pri aktualizácií fotky došlo k chybe. Skúste znova!'});
    });
  }

  handleClick() {
    var input = document.createElement("input");
    input.type = "file";
    input.onchange = this.handleImageChange;
    input.click();
  }

  handleRemove() {
    this.setState({
      file: null,
      imagePreviewUrl: this.props.photoUrl ? this.props.photoUrl : avatarImg
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.avatarContainer}>
        <img src={this.state.imagePreviewUrl} alt="..." className={classes.img} />
        {this.state.file === null ?
          <Button color="nexteriaOrange" customClass={classes.avatarChangeButton} onClick={() => this.handleClick()}>
            Zmeniť
          </Button>
          : null
        }
        {this.state.file !== null && !this.state.uploading ?
          <span className={classes.confirmButtonContainer}>
            <IconButton size="small" color="success" onClick={() => this.handleSubmit()}>
              <Check />
            </IconButton>
            
            <IconButton size="small" color="danger" onClick={() => this.handleRemove()}>
              <Close />
            </IconButton>
          </span>
          : null
        }

        {this.state.uploading ?
          <Button color="nexteriaOrange" customClass={classes.avatarChangeButton}>
            <Spinner name='line-scale-pulse-out' fadeIn="none" className={classes.buttonSpinner} color="#fff" />
          </Button>
          : null
        }
      </div>
    );
  }
}

const photoMutation = gql`
  mutation UpdateUserProfilePhoto(
    $profilePicture: Upload!
  ) {
    UpdateUserProfilePhoto(
      profilePicture: $profilePicture
    ) {
      id
      profilePicture {
        id
        filePath
      }
    }
  }
`;

export default compose(
  connect(state => ({ userId: state.user.id })),
  graphql(photoMutation, { name: 'updatePhoto' }),
)(ProfileAvatarForm);