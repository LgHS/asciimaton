import React from "react";

class Webcam extends React.Component {
  componentDidMount() {
    const self = this;
    this.canvas = this.refs['webcamCanvas'];
    const context = this.canvas.getContext("2d");
    const video = document.createElement("video");
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
        video.src = window.URL.createObjectURL(stream);
        video.onplaying = () => {
          this.animationFrame = requestAnimationFrame(loop);
        };
        video.onpause = () => {
          cancelAnimationFrame(this.animationFrame);
        };
        video.play();
      }, errBack);
    }

    const loop = () => {
      // context.scale(1, -1);
      context.rotate(-90 * Math.PI / 180);
      // context.drawImage(video, self.props.vertical_crop, self.props.horizontal_crop,
      //     self.canvas.height - (self.props.vertical_crop * 2), self.canvas.width - (self.props.horizontal_crop * 2));
      context.drawImage(video, 0, 0, self.canvas.height, self.canvas.width);
      context.setTransform(1, 0, 0, 1, 0, self.canvas.height);
      // context.translate(0, canvas.width);
      self._convertToGreyscale(context, this.canvas);
      this.animationFrame = requestAnimationFrame(loop);
    };
  }

  _convertToGreyscale(context, canvas) {
    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      let bright = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      data[i] = bright;
      data[i + 1] = bright;
      data[i + 2] = bright;
    }
    context.putImageData(imageData, 0, 0);
  }

  getResizedSnapshot() {
    if(!this.canvas || !this.context) {
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

  getSnapshot() {
    if(!this.canvas || !this.context) {
      console.warn('No canvas or context found for snapshot, aborting');
      return;
    }
    return this.canvas.toDataURL();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrame);
    this.canvas = null;
  }

  render() {
    return (
        <div>
          <canvas className="webcam-canvas" ref="webcamCanvas" height={this.props.height} width={this.props.width}/>
        </div>
    )
  }
}

export default Webcam;