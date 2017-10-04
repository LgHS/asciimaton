import React from "react";
import Konami from "react-konami";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {enterGodMode, exitGodMode, openSettings} from "../actions/actions";

const DebugBar = ({godMode, onSettingsClick, onKonamiCode, onClose}) => {
  let navbar = null;
  if (godMode) {
    navbar = (
      <div>
        <a href="" onClick={onSettingsClick}>
          Open Settings
        </a>

        —
        {/*<nav className='debugbar__nav'>*/}
          {/*<Link to='/'>Home</Link>*/}
          {/*<Link to='/live'>Live</Link>*/}
          {/*<Link to='/still'>Still</Link>*/}
          {/*<Link to='/print'>Printing</Link>*/}
          {/*<Link to='/share'>Facebook</Link>*/}
        {/*</nav>*/}

        <a href="" onClick={onClose}>Exit God Mode</a>
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


const mapStateToProps = state => {
  return {
    godMode: state.ui.godMode
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onKonamiCode: () => {
      dispatch(enterGodMode());
    },
    onSettingsClick: (e) => {
      e.preventDefault();
      dispatch(openSettings());
    },
    onClose: (e) => {
      e.preventDefault();
      dispatch(exitGodMode());
    }
  }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebugBar);