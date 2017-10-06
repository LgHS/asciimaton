import Modal from 'react-modal';
import React from "react";
import {connect} from "react-redux";
import {closeSettings, updateSocketSettings, updateWebcamSettings} from "../actions/actions";

class Error extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Modal>
          <main>
            Erreur: {this.props.errorMessage}
          </main>
        </Modal>
    );
  }
}

export default connect(
    (state) => {
      return {
      };
    },
    (dispatch) => {
      return {
      }
    }
)(Error);