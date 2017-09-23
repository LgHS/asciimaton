import React from 'react';
import {Switch, Route, Link} from 'react-router-dom';

import Communication from './communication/Communication';

// Import pages
import Home from './pages/Home';
import Live from './pages/Live';
import Still from './pages/Still';
import Printing from './pages/Printing';
import Facebook from './pages/Facebook';

const App = () => (
    <main>
      <Communication/>
      <nav className='app__nav'>
        <Link to='/'>Home</Link>
        <Link to='/live'>Live</Link>
        <Link to='/still'>Still</Link>
        <Link to='/printing'>Printing</Link>
        <Link to='/facebook'>Facebook</Link>
      </nav>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/live" component={Live}/>
        <Route path="/still" component={Still}/>
        <Route path="/printing" component={Printing}/>
        <Route path="/facebook" component={Facebook}/>
      </Switch>
    </main>
);

export default App;