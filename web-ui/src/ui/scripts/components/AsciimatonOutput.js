import * as React from "react";
import {connect} from "react-redux";

const WebcamOutput = ({asciimatonOutput, transparency}) => {
  let cls = "asciimaton-output";

  cls += transparency ? ' asciimaton-output__transparency' : '';

  return (
      <div className={cls}>
        <img src={asciimatonOutput} width={768} height={768/0.707}/>
      </div>
  );
};

export default connect(
    (state) => {
      return {
        asciimatonOutput: state.asciimaton.asciimatonOutput
      }
    }
)(WebcamOutput);
