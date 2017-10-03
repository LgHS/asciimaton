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
 *   - printer.isReady
 - button.isPressed({color: "RED"|"GREEN"|"BLUE"})
 - asciimaton.output({picture: base64buffer})

 ### From client
 - led.changeState({color: "RED"|"GREEN"|"BLUE", state: "HIGH|LOW"})
 - webcam.output({picture: base64buffer})
 - printer.print
 - asciimaton.save
 */
io.on('connection', function(client) {
  console.log('Client connected...');
  displayButtons({});

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

  client.on('led.changeState', (data) => {
    if(COLORS.includes(data.color) && data.state) {
      leds[data.color] = data.state;
      displayButtons(leds);
    }
  });
});

const displayButtons = (colors) => {
  const green = colors.green === 'HIGH' ? 'x' : ' ';
  const red = colors.red === 'HIGH' ? 'x' : ' ';
  const blue = colors.blue === 'HIGH' ? 'x' : ' ';

  console.log('\n' + ` ${green} `.bgGreen + ' ' + ` ${red} `.bgRed + ' ' + ` ${blue} `.bgBlue);
  replServer.displayPrompt();
};

server.listen(54321);