import React from "react";
import Konami from "react-konami";
import {Link} from "react-router-dom";

const DebugBar = ({godMode, onSettingsClick, onKonamiCode, onClose}) => {
  let navbar = null;
  if (godMode) {
    navbar = (
      <div>
        <a href="#" onClick={() => onSettingsClick()}>
          Open Settings
        </a>

        <nav className='debugbar__nav'>
          <Link to='/'>Home</Link>
          <Link to='/live'>Live</Link>
          <Link to='/still'>Still</Link>
          <Link to='/printing'>Printing</Link>
          <Link to='/facebook'>Facebook</Link>
        </nav>

        <a href="#" onClick={onClose}>Exit God Mode</a>
      </div>
    );
  }

  return (
      <div className='debugbar'>
        <Konami easterEgg={onKonamiCode}/>
        {navbar}

      </div>
  );
};

export default DebugBar;