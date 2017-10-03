import Modal from 'react-modal';
import React from "react";
import {connect} from "react-redux";
import {closeSettings, updateSocketSettings} from "../actions/actions";

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
          <form onSubmit={this.props.handleFormSubmit.bind(this)}>
            <p>
              <label htmlFor='socket_server_url'>Socket server URL</label>
              <input type='text' ref='socket_server_url' id='socket_server_url' defaultValue={this.props.ui.socketServer.url}/>
            </p>
            <p>
              <label htmlFor="socket_server_port">Socket server port</label>
              <input type='number' ref='socket_server_port' id='socket_server_port' defaultValue={this.props.ui.socketServer.port} />
            </p>
            <p>
              <button type='submit'>Save</button>
            </p>
          </form>
        </main>

        <a href="#" className='modal__close' onClick={this.props.handleModalclose}>X</a>
      </Modal>
    );
  }
}

export default connect(
    (state) => {
      return {
        ui: state.ui
      };
    },
    (dispatch) => {
      return {
        handleModalclose() {
          dispatch(closeSettings());
        },
        handleFormSubmit(e) {
          const serverData = {
            url: this.refs['socket_server_url'].value,
            port: this.refs['socket_server_port'].value
          };
          dispatch(updateSocketSettings(serverData));
          e.preventDefault();
        }
      }
    }
)(Settings);