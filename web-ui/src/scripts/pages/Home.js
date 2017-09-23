import React from 'react';
import {Link} from 'react-router-dom';

import Logo from '../../assets/images/logo.png';

const Home = () => (
    <div className="page__home">
      <h1 className='logo'>
        <img src={Logo} />
      </h1>
    </div>
);

export default Home;