import Modal from 'react-modal';
import React from "react";
import {connect} from "react-redux";
import {closeSettings, updateSocketSettings, updateWebcamSettings} from "../actions/actions";

class Settings extends React.Component {
  constructor() {
    super();
    // return {
    //   server: {
    //     url: 'localhost',
    //     port: 54321
    //   }
    // };
  }

  render() {
    return (
        <Modal isOpen={this.props.ui.isSettingsModalOpened} contentLabel="Modal">
          <main>
            <form onSubmit={this.props.handleSocketFormSubmit.bind(this)}>
              <h3>Socket server</h3>
              <p>
                <label htmlFor='socket_server_url'>Socket server URL</label>
                <input type='text' ref='socket_server_url' id='socket_server_url'
                       defaultValue={this.props.ui.socketServer.url}/>
              </p>
              <p>
                <label htmlFor="socket_server_port">Socket server port</label>
                <input type='number' ref='socket_server_port' id='socket_server_port'
                       defaultValue={this.props.ui.socketServer.port}/>
              </p>

              <p>
                <button type='submit'>Save</button>
              </p>
            </form>

            <form onSubmit={this.props.handleWebcamFormSubmit.bind(this)}>
              <h3>Webcam</h3>
              <p>
                <label htmlFor='webcam_width'>Webcam width</label>
                <input type='number' ref='webcam_width' id='webcam_width' defaultValue={this.props.webcam.width}/>
              </p>
              <p>
                <label htmlFor='webcam_height'>Webcam height</label>
                <input type='number' ref='webcam_height' id='webcam_height' defaultValue={this.props.webcam.height}/>
              </p>
              {/*<p>*/}
                {/*<label htmlFor='webcam_horizontal_crop'>Horizontal crop</label>*/}
                {/*<input type='number' ref='webcam_horizontal_crop' id='webcam_horizontal_crop'*/}
                       {/*defaultValue={this.props.webcam.horizontal_crop}/>*/}
              {/*</p>*/}
              {/*<p>*/}
                {/*<label htmlFor='webcam_vertical_crop'>Vertical crop</label>*/}
                {/*<input type='number' ref='webcam_vertical_crop' id='webcam_vertical_crop'*/}
                       {/*defaultValue={this.props.webcam.vertical_crop}/>*/}
              {/*</p>*/}

              <p>
                <button type='submit'>Save</button>
              </p>
            </form>
          </main>

          <a href="" className='modal__close' onClick={this.props.handleModalClose}>X</a>
        </Modal>
    );
  }
}

export default connect(
    (state) => {
      return {
        ui: state.ui,
        webcam: state.webcam,
      };
    },
    (dispatch) => {
      return {
        handleModalClose(e) {
          e.preventDefault();
          dispatch(closeSettings());
        },
        handleSocketFormSubmit(e) {
          const serverData = {
            url: this.refs['socket_server_url'].value,
            port: this.refs['socket_server_port'].value
          };
          dispatch(updateSocketSettings(serverData));
          e.preventDefault();
        },
        handleWebcamFormSubmit(e) {
          const webcamData = {
            width: this.refs['webcam_width'].value,
            height: this.refs['webcam_height'].value,
            // horizontal_crop: this.refs['webcam_horizontal_crop'].value,
            // vertical_crop: this.refs['webcam_vertical_crop'].value
          };
          dispatch(updateWebcamSettings(webcamData));
          e.preventDefault();
        }
      }
    }
)(Settings);
