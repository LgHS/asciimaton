import React from 'react';
import AsciimatonOutput from "../components/AsciimatonOutput";

class Print extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dotCount: 0
    }
  }

  componentDidMount() {
    this.dotsInterval = setInterval(() => {
      this.setState({
        dotCount: this.state.dotCount <= 2 ? this.state.dotCount + 1 : 0
      });
    }, 800);
  }

  componentWillUnmount() {
    clearInterval(this.dotsInterval);
  }

  render() {

    return (
        <div className='page page__print'>
          <AsciimatonOutput transparency />
          <div className="page__text">
            <p>Printing</p>
            <p className="dots">
              &nbsp;
              {".".repeat(this.state.dotCount)}
              &nbsp;;,
            </p>
          </div>
        </div>
    );
  }
}

export default Print;
``