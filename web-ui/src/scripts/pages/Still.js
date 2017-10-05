import React from 'react';
import {connect} from "react-redux";

const Still = ({asciimatonOutput, webcam}) => (
    <div className="page page__still">
      <img src={asciimatonOutput} width={webcam.width} height={webcam.height} />
    </div>
);

export default connect(
    (state) => {
      return {
        webcam: state.webcam,
        asciimatonOutput: state.asciimaton.asciimatonOutput
      }
    }
)(Still);