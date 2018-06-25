import React from 'react';
import Webcam from "../components/Webcam";
import AsciimatonOutput from "../components/AsciimatonOutput";
import {changeState, setWebcamOutput} from "../actions/actions";
import {connect} from "react-redux";

class Print extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dotCount: 0
    }
  }

  componentDidMount() {
    // this.dotsInterval = setInterval(() => {
    //   this.setState({
    //     dotCount: this.state.dotCount <= 2 ? this.state.dotCount + 1 : 0
    //   });
    // }, 800);
  }

  componentWillUnmount() {
    clearInterval(this.dotsInterval);
  }

  render() {

    return (
        <div className='page page__print'>
          {/*<Webcam ref={(webcam) => this.webcam = webcam} width={this.props.webcam.width}*/}
                  {/*height={this.props.webcam.height}*/}
                  {/*brightnessModifier={this.props.webcam.brightnessModifier}*/}
                  {/*contrastModifier={this.props.webcam.contrastModifier}*/}
                  {/*horizontal_crop={this.props.webcam.horizontal_crop}*/}
                  {/*vertical_crop={this.props.webcam.vertical_crop}/>*/}
          <AsciimatonOutput transparency />

          <div className="page__text">
            <p>ça imprime !</p>
          </div>
        </div>
    );
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
)(Print);
