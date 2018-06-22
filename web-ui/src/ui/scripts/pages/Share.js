import React from 'react';
import AsciimatonOutput from "../components/AsciimatonOutput";

const Share = () => (
    <div className='page page__share'>
      <AsciimatonOutput transparency  />
      <p className='page__text'>
        Affichez vous<br/>
        <span className="link">
          Voulez-vous faire partie du mur à cul ?
        </span>
      </p>
    </div>
);

export default Share;
