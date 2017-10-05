import React from 'react';
import io from 'socket.io-client';
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import {changeState, removeWebcamOutput, setAsciimatonOutput, setSocketConnected} from "../actions/actions";
import {COLORS, STATE_MACHINE, STATES} from "../reducers/state-machine";
import {decreaseBrightness, decreaseContrast, increaseBrightness, increaseContrast} from "../actions/webcamActions";

let socket = null;

class Communication extends React.Component {
  componentDidMount() {
    this._initSocket(this.props.ui.socketServer);
  }

  componentWillReceiveProps(nextProps) {
    const self = this;

    // Update buttons and leds on state change
    // (check that wanted state is different than current)
    if(this.props.stateMachine.name !== nextProps.stateMachine.name) {
      this._updateLeds(nextProps.stateMachine.leds);

      // update callback when button is pressed based on new state
      socket.removeAllListeners("button.isPressed");
      socket.on('button.isPressed', (data) => {
        if (COLORS.includes(data.color)) {
          const nextState = nextProps.stateMachine.buttons[data.color].next;
          const payload = nextProps.stateMachine.buttons[data.color].payload;
          if (nextState) {
            self._changeState(nextState, payload);
          }
        }
      });
    }

    // Add socket to window in god mode
    if(this.props.ui.godMode !== nextProps.ui.godMode) {
      window.socket = nextProps.ui.godMode ? socket : null;
    }

    // check that socket server config has changed
    if(this.props.ui.socketServer.url !== nextProps.ui.socketServer.url
        || this.props.ui.socketServer.port !== nextProps.ui.socketServer.port) {
      this._initSocket(nextProps.ui.socketServer);
    }

    // check that we have a output to send to server
    if(!this.props.asciimaton.webcamOutput && nextProps.asciimaton.webcamOutput) {
      socket.emit('webcam.output', {
        picture: nextProps.asciimaton.webcamOutput
      });
      // remove asciimaton data from state
      this.props.removeWebcamOutput();
    }

    // send print signal to server
    if(this.props.stateMachine.name === STATES.STILL && nextProps.stateMachine.name === STATES.SHARE) {
      socket.emit('printer.print');
    }

    // send share action to server
    if(this.props.stateMachine.name === STATES.SHARE && nextProps.stateMachine.name === STATES.PRINT) {
      if(nextProps.stateMachine.payload.share) {
        socket.emit('asciimaton.save');
      }
    }
  }

  _initSocket(socketServer) {
    const self = this;

    if(socket) {
      self._changeState(STATES.NOT_CONNECTED);
      self.props.setSocketConnected(false);
      socket.disconnect();
      socket.removeAllListeners('connect');
      socket.removeAllListeners('connect_error');
    }

    socket = io.connect(`http://${socketServer.url}:${socketServer.port}`);
    window.socket = socket;

    socket.on('connect', () => {
      self._changeState(STATES.LOGO);
      self.props.setSocketConnected(true);
    });

    socket.on('connect_error', function() {
      self._changeState(STATES.NOT_CONNECTED);
      self.props.setSocketConnected(false);
    });

    socket.on('asciimaton.output', (data) => {
      self.props.setAsciimatonOutput(data.picture);
      self._changeState(STATES.STILL);
    });

    socket.on('printer.isReady', () => {
      self.props.removeWebcamOutput();
      self.props.setAsciimatonOutput(null);
      self._changeState(STATES.LOGO);
    });

    socket.on('control.increaseBrightness', () => { self.props.increaseBrightness(); });
    socket.on('control.decreaseBrightness', () => { self.props.decreaseBrightness(); });
    socket.on('control.increaseContrast', () => { self.props.increaseContrast(); });
    socket.on('control.decreaseContrast', () => { self.props.decreaseContrast(); });
    socket.on('control.reload', () => { window.location.reload(); });
  }

  _changeState(nextState, payload) {
    if(STATE_MACHINE[nextState].url) {
      this.props.history.push(STATE_MACHINE[nextState].url);
    }
    this.props.changeState(nextState, payload);
  }

  _updateLeds(leds) {
    // green
    socket.emit('led.changeState', {
      color: 'green',
      state: leds['green'] ? 'high' : 'low'
    });
    // red
    socket.emit('led.changeState', {
      color: 'red',
      state: leds['red'] ? 'high' : 'low'
    });
    // blue
    socket.emit('led.changeState', {
      color: 'blue',
      state: leds['blue'] ? 'high' : 'low'
    });
  }

  render() { return null; }
}

const mapStateToProps = state => {
  return {
    stateMachine: state.stateMachine,
    ui: state.ui,
    asciimaton: state.asciimaton
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSocketConnected: (isSocketConnected) => {
      dispatch(setSocketConnected(isSocketConnected));
    },
    changeState: (state, payload) => {
      dispatch(changeState(state, payload));
    },
    removeWebcamOutput: () => {
      dispatch(removeWebcamOutput());
    },
    setAsciimatonOutput: (picture) => {
      dispatch(setAsciimatonOutput(picture));
    },
    increaseBrightness: () => {
      dispatch(increaseBrightness());
    },
    decreaseBrightness: () => {
      dispatch(decreaseBrightness());
    },
    increaseContrast: () => {
      dispatch(increaseContrast());
    },
    decreaseContrast: () => {
      dispatch(decreaseContrast());
    },
  }
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Communication));