import React from 'react';
import Webcam from "../components/Webcam";
import {connect} from "react-redux";
import {STATE_MACHINE, STATES} from "../reducers/state-machine";
import {changeState, setWebcamOutput} from "../actions/actions";

class Capture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countDown: null,
      waiting: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const self = this;

    // Start countdown then go to STILL state
    if (nextProps.stateMachine.name === STATES.COUNTDOWN) {
      let tick = 3;
      const countDownInterval = setInterval(function () {
        if (tick > 0) {
          self.setState({countDown: tick});
          tick--;
        } else {
          self.setState({countDown: null});
          clearInterval(countDownInterval);
          // send output to server
          const smallSnapshot = self.webcam.getResizedSnapshot();
          self.props.setWebcamOutput(smallSnapshot);

          // wait for server response
          self.props.changeState(STATES.WAITING);
        }
      }, 1000);
    }

    // wait for server response
    if (this.props.stateMachine.name === STATES.COUNTDOWN && nextProps.stateMachine.name === STATES.WAITING) {
      this.setState({
        waiting: true
      });
    }
  }

  render() {
    let countDown = null;

    if (this.state.countDown) {
      countDown = (
          <div className='countdown page__text'>
            {this.state.countDown}
          </div>
      )
    }

    if (!this.state.waiting) {
      return (
          <div className="page page__live">
            <Webcam ref={(webcam) => this.webcam = webcam} width={this.props.webcam.width}
                    height={this.props.webcam.height}
                    brightnessModifier={this.props.webcam.brightnessModifier}
                    contrastModifier={this.props.webcam.contrastModifier}
                    horizontal_crop={this.props.webcam.horizontal_crop}
                    vertical_crop={this.props.webcam.vertical_crop}/>
            {countDown}
          </div>
      );
    }

    return null;
  }
}

export default connect(
    (state) => {
      return {
        webcam: state.webcam,
        stateMachine: state.stateMachine
      }
    },
    (dispatch) => {
      return {
        changeState: (state) => {
          dispatch(changeState(state));
        },
        setWebcamOutput: (picture) => {
          dispatch(setWebcamOutput(picture));
        }
      }
    }
)(Capture);
