import React from "react";

// Cross-browser compatibility
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

class Webcam extends React.Component {
  componentDidMount() {
    const self = this;
    this.canvas = this.refs['webcamCanvas'];
    this.video = document.createElement("video");
    this.animationFrame = null;
    const videoObject = {
      video: true,
      audio: false
    };

    const errBack = (error) => {
      console.error("Video capture error: ", error.code);
    };

    if (navigator.getUserMedia) {
      navigator.getUserMedia(videoObject, (stream) => {
        self.video.src = window.URL.createObjectURL(stream);
        self.video.play();

        // FIXME very very ugly
        if(window.socket) {
          window.socket.emit('forceV4l2Settings');
        }

        self._initAnimationLoop({
          brightnessModifier: self.props.brightnessModifier,
          canvas: self.canvas,
          contrastModifier: self.props.contrastModifier,
          video: self.video,
        });
      }, errBack);
    } else {
      console.log('Native device media streaming (getUserMedia) not supported in this browser.');
    }
  }

  _initAnimationLoop({canvas, contrastModifier, brightnessModifier, video}) {
    cancelAnimationFrame(this.animationFrame);
    const loop = () => {
      if (canvas) {
        const context = canvas.getContext("2d");
        context.rotate(90 * Math.PI / 180);
        context.drawImage(video, 0, 0, 1024, 768);
        context.setTransform(-1, 0, 0, 1, 0, 0);
        // context.filter = `contrast(${100 + (contrastModifier * 10)}%) grayscale(100%) brightness(${100 + (brightnessModifier * 10)}%)`;
      }
      this.animationFrame = requestAnimationFrame(loop);
    };
    this.animationFrame = requestAnimationFrame(loop);
  }

  getSnapshot() {
    if(!this.canvas || !this.context) {
      console.warn('No canvas or context found for snapshot, aborting');
      return;
    }

    return this.canvas.toDataURL();
  }

  getResizedSnapshot() {
    if (!this.canvas || !this.context) {
      console.warn('No canvas or context found for snapshot, aborting');
      return;
    }

    // resize image before sending to server
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.setAttribute("width", "192");
    resizedCanvas.setAttribute("height", "264");
    const resizedContext = resizedCanvas.getContext('2d');
    resizedContext.drawImage(this.canvas, 0, 0, 192, 264);

    return resizedCanvas.toDataURL();
  }

  componentWillReceiveProps(nextProps) {
    this._initAnimationLoop({
      canvas: this.canvas,
      contrastModifier: nextProps.contrastModifier,
      brightnessModifier: nextProps.brightnessModifier,
      video: this.video,
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrame);
    this.canvas = null;
  }

  render() {
    return (
        <div className="webcam">
          <canvas className="webcam-canvas" ref="webcamCanvas" height={this.props.height} width={this.props.width}/>
        </div>
    )
  }
}

export default Webcam;
