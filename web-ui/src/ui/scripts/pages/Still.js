import React from 'react';
import {connect} from "react-redux";
import AsciimatonOutput from "../components/AsciimatonOutput";

const Still = ({asciimatonOutput}) => (
    <div className="page page__still">
      <AsciimatonOutput />
    </div>
);

export default Still;