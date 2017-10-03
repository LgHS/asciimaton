import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './components/App';
import {router} from './router';
import {store} from './store';

ReactDOM.render((
    <Provider store={store}>
      {router}
    </Provider>
), document.getElementById('root'));