import React from "react";
import {Link} from 'react-router-dom';
import "../../styles/main.scss";

import Communication from '../communication/Communication';


// app component
export default class App extends React.Component {
  // render
  render() {
    return (
        <main>
          <Communication/>

          <nav className='app__nav'>
            <Link to='/'>Home</Link>
            <Link to='/live'>Live</Link>
            <Link to='/still'>Still</Link>
            <Link to='/printing'>Printing</Link>
            <Link to='/facebook'>Facebook</Link>
          </nav>

          <div className="container">
            {this.props.children}
          </div>
        </main>
    );
  }
}
