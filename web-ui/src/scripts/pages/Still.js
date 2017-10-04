import React from 'react';
import {connect} from "react-redux";

const Still = ({asciimatonOutput, ui}) => (
    <div className="page page__still">
      <img src={asciimatonOutput} width={ui.webcam.width} height={ui.webcam.height} />
    </div>
);

export default connect(
    (state) => {
      return {
        ui: state.ui,
        asciimatonOutput: state.asciimaton.asciimatonOutput
      }
    }
)(Still);