import React from 'react';

const Reload = ({onClick}) => (
    <button type="button" onClick={(e) => {onClick(); e.preventDefault();}}>
      Reload UI
    </button>
);

export default Reload;
