// app.js
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const colors = require('colors');
const repl = require('repl');

const replServer = repl.start({
  prompt: "asciimaton > ",
  useColors: true
});

const COLORS = ['red', 'green', 'blue'];
let leds = {
  green: false,
  red: false,
  blue: false
};

app.use(express.static(__dirname + '/node_modules'));

/**
 ### From Server
 - printer.isReady
 - button.isPressed({color: "RED"|"GREEN"|"BLUE"})
 - asciimaton.output({asciimaton: base64buffer})
 - webcam.updateFilter({type: "contrast"|"brightness", modifier: "increase"|"decrease"})
 - ui.reload

 ### From client
 - led.changeState({color: "RED"|"GREEN"|"BLUE", state: "HIGH|LOW"})
 - webcam.output({asciimaton: base64buffer})
 - printer.print
 - asciimaton.save

 ### Remote control
 Namespace: /control
 - webcam.updateFilter({type: "contrast"|"brightness", modifier: "increase"|"decrease"})
 - ui.reload
 - pressButton({color: "red"|"green"|"blue"})
 */
io.on('connection', function(client) {
  console.log('Client connected...');
  defineCommands(client);
  displayButtons({});

  client.on('led.changeState', (data) => {
    if(COLORS.includes(data.color) && data.state) {
      leds[data.color] = data.state;
      displayButtons(leds);
    }
  });

  client.on('webcam.output', (data) => {
    client.emit('asciimaton.output', data);
  });

  client.on('printer.print', () => {
    console.log('Print...');
    replServer.displayPrompt();
  });

  client.on('asciimaton.save', () => {
    console.log('Save picture on hard drive');
    replServer.displayPrompt();
  });

  client.on('control.pressButton', (data) => {
    io.sockets.emit('button.isPressed', data.color);
  });
});

const displayButtons = (colors) => {
  const green = colors.green === 'high' ? 'x' : ' ';
  const red = colors.red === 'high' ? 'x' : ' ';
  const blue = colors.blue === 'high' ? 'x' : ' ';

  console.log('\n' + ` ${green} `.bgGreen + ' ' + ` ${red} `.bgRed + ' ' + ` ${blue} `.bgBlue);
  replServer.displayPrompt();
};

const defineCommands = (client) => {
  replServer.defineCommand('press', {
    help: 'Use this to simulate button press',
    action(rawColor) {
      this.bufferedCommand = '';
      let color = rawColor.toLowerCase();
      if(COLORS.includes(color)) {
        client.emit('button.isPressed', {color});
        console.log(`Button ${color} pressed`);
      } else {
        console.error(`Color ${color} not valid`);
      }
      this.displayPrompt();
    }
  });

  replServer.defineCommand('printerIsReady', {
    help: 'Use this to reset UI',
    action() {
      this.bufferedCommand = '';
      client.emit('printer.isReady');
      this.displayPrompt();
    }
  });

  replServer.defineCommand('increaseBrightness', {
    help: "Increase webcam brightness",
    action() {
      this.bufferedCommand = '';
      client.emit('control.increaseBrightness');
      this.displayPrompt();
    }
  });

  replServer.defineCommand('decreaseBrightness', {
    help: "Decrease webcam brightness",
    action() {
      this.bufferedCommand = '';
      client.emit('control.decreaseBrightness');
      this.displayPrompt();
    }
  });

  replServer.defineCommand('increaseContrast', {
    help: "Increase webcam contrast",
    action() {
      this.bufferedCommand = '';
      client.emit('control.increaseContrast');
      this.displayPrompt();
    }
  });

  replServer.defineCommand('decreaseContrast', {
    help: "Decrease webcam contrast",
    action() {
      this.bufferedCommand = '';
      client.emit('control.decreaseContrast');
      this.displayPrompt();
    }
  });

  replServer.defineCommand('reload', {
    help: "Reload UI",
    action() {
      this.bufferedCommand = '';
      client.emit('control.reload');
      this.displayPrompt();
    }
  });

};

server.listen(54321);