import React from 'react';
import io from 'socket.io-client';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {changeState, setSocketConnected} from "../actions/actions";
import {COLORS, STATE_MACHINE, STATES} from "../reducers/state-machine";

const socket = io('http://localhost:54321');

class Communication extends React.Component {
  componentDidMount() {
    const self = this;

    socket.on('connect', () => {
      self._changeState(STATES.LOGO);
      self.props.setSocketConnected(true);
    });

    socket.on('connect_error', function() {
      self._changeState(STATES.NOT_CONNECTED);
      // socket.disconnect();
      self.props.setSocketConnected(false);
    });
  }

  componentWillReceiveProps(nextProps) {
    const self = this;

    // check that wanted state is different than current
    if(this.props.stateMachine.name === nextProps.stateMachine.name) {
      return;
    }

    this._updateLeds(nextProps.stateMachine.leds);
    console.log('update leds', nextProps.stateMachine.leds);

    socket.removeAllListeners("button.isPressed");
    socket.on('button.isPressed', (data) => {
      if(COLORS.includes(data.color)) {
        const nextState = nextProps.stateMachine.buttons[data.color];
        if(nextState) {
          self._changeState(nextProps.stateMachine.buttons[data.color]);
        }
      }
    });
  }

  _changeState(nextState) {
    this.props.history.push(STATE_MACHINE[nextState].url);
    this.props.changeState(nextState);
  }

  _updateLeds(leds) {
    // green
    socket.emit('led.changeState', {
      color: 'green',
      state: leds['green'] ? 'HIGH' : 'LOW'
    });
    // red
    socket.emit('led.changeState', {
      color: 'red',
      state: leds['red'] ? 'HIGH' : 'LOW'
    });
    // blue
    socket.emit('led.changeState', {
      color: 'blue',
      state: leds['blue'] ? 'HIGH' : 'LOW'
    });
  }

  render() { return null; }
}

const mapStateToProps = state => {
  return {
    stateMachine: state.stateMachine
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSocketConnected: (isSocketConnected) => {
      dispatch(setSocketConnected(isSocketConnected));
    },
    changeState: (state) => {
      dispatch(changeState(state));
    }
  }
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Communication));