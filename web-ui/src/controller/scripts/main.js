import React from 'react';
import ReactDOM from 'react-dom';
import styles from "../styles/main.scss";
import Button from "./components/Button";
import LineThickness from "./components/LineThickness";
import Reload from "./components/Reload";
import WebcamFilter from "./components/WebcamFilter";

import io from 'socket.io-client';

const socket = io.connect(`${window.socketUrl}/control`);
window.socket = io.connect(`${window.socketUrl}/ui`);

const handleButtonClick = (color) => {
  socket.emit('button.isPressed', {color});
};

const handleFilterClick = ({filter, action}) => {
  socket.emit('webcam.updateFilter', {
    action,
    filter
  });
};

const handleThicknessClick = (thickness) => {
  socket.emit('printer.setLineThickness', {thickness});
};

const handleReloadClick = () => {
  socket.emit('ui.reload');
};

ReactDOM.render((
    <main className='app'>
      <section className="app-section app-section__buttons">
        <Button onClick={handleButtonClick} color="green" label="OK"/>
        <Button onClick={handleButtonClick} color="red" label="CANCEL"/>
        <Button onClick={handleButtonClick} color="blue" label="PRINT"/>
      </section>

      <section className="app-section app-section__webcam-filters">
        <WebcamFilter onClick={handleFilterClick} filter="brightness" />
        <WebcamFilter onClick={handleFilterClick} filter="contrast" />
      </section>

      <section className='app-section app-section__line-thickness'>
        <LineThickness onClick={handleThicknessClick} />
      </section>

      <section className="app-section app-section__reload">
        <Reload onClick={handleReloadClick} />
      </section>
    </main>
), document.getElementById('root'));