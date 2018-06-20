import React from 'react';

import Logo from '../../assets/images/logo-fesse_rose_600.png';
import {connect} from "react-redux";

const Home = ({isSocketConnected}) => {
  if (isSocketConnected) {
    return (
        <div className="page page__home">
          <h1 className='logo'>
            <img src={Logo}/>
          </h1>
        </div>
    );
  } else {
    return (
        <div className="page page__home">
          <p className="page__text">
            Waiting for connection...
          </p>
        </div>
    );
  }
};

export default connect(
    (state) => {
      return {
        isSocketConnected: state.ui.isSocketConnected
      };
    },
    null
)(Home);
