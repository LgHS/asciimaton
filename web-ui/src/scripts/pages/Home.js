import React from 'react';

import Logo from '../../assets/images/logo.png';
import {connect} from "react-redux";

const Home = ({isSocketConnected}) => {
  if (isSocketConnected) {
    return (
        <div className="page__home">
          <h1 className='logo'>
            <img src={Logo}/>
          </h1>
        </div>
    );
  } else {
    return (
        <p>Waiting for connection</p>
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