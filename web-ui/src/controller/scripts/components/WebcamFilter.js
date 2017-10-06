import React from 'react';

const WebcamFilter = ({filter, onClick}) => (
    <div className="webcam-filter">
      <span>{filter}</span>
      <button onClick={(e) => { onClick({filter, action: "decrease"}); e.preventDefault(); }} type="button">-</button>
      <button onClick={(e) => { onClick({filter, action: "increase"}); e.preventDefault(); }} type="button">+</button>
    </div>
);

export default WebcamFilter;