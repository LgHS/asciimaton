import React from 'react';
import AsciimatonOutput from "../components/AsciimatonOutput";

const Share = () => (
    <div className='page page__share'>
      <AsciimatonOutput transparency  />
      <p className='page__text'>
        Share on Facebook ? <br/>
        <span className="link">
          facebook.com/liegehackerspace/
        </span>
      </p>
    </div>
);

export default Share;