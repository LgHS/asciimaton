import * as React from "react";

const Button = ({color, label, onClick}) => (
  <button onClick={(e) => {onClick(color); e.preventDefault();}} className={`btn btn__${color}`}>
    {label}
  </button>
);

export default Button;
