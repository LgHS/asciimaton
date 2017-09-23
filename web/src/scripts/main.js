import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
import style from '../styles/main.scss';

import App from './App';

ReactDOM.render((
    <HashRouter>
      <App/>
    </HashRouter>
), document.getElementById('root'));