import React from 'react';
import io from 'socket.io-client';
import {withRouter} from 'react-router-dom';

const socket = io('http://localhost:4200');

class Communication extends React.Component {
  componentDidMount() {
    const self = this;
    socket.on('test', data => {
      console.log(self.props);
      self.props.history.push('/live');
    });

    socket.on('connect_error', function() {
      console.log('Got disconnect!');
      socket.disconnect();
    });
  }

  render() {
    return (<div/>);
  }
}

export default withRouter(Communication);