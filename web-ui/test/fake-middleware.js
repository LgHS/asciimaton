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

const uiNamespace = io.of('/ui');
const controlNamespace = io.of('/control');


/**
 * Handle UI messages
 */
uiNamespace.on('connection', function(uiClient) {
  console.log('UI client connected');
  _displayButtons({});

  uiClient.on('led.changeState', (data) => {
    if(COLORS.includes(data.color) && data.state) {
      leds[data.color] = data.state;
      _displayButtons(leds);
    }
  });

  uiClient.on('webcam.output', (data) => {
    uiNamespace.emit('asciimaton.output', data);
  });

  uiClient.on('printer.print', () => {
    console.log('Print...');
    replServer.displayPrompt();
  });

  uiClient.on('asciimaton.save', () => {
    console.log('Save picture on hard drive');
    replServer.displayPrompt();
  });
});

/**
 * Handle Control messages
 */
controlNamespace.on('connection', (controlClient) => {
  console.log('Controller client connected');

  controlClient.on('webcam.updateFilter', (payload) => {
    console.log('updateFilter', payload);
    uiNamespace.emit('webcam.updateFilter', payload);
    console.log('Control: forwarding webcam.updateFilter to UI');
  });
  controlClient.on('button.isPressed', (payload) => {
    uiNamespace.emit('button.isPressed', payload);
    console.log('Control: forwarding button.isPressed to UI');
  });
  controlClient.on('ui.reload', () => {
    uiNamespace.emit('ui.reload');
    console.log('Control: forwarding ui.reload to UI');
  });
  controlClient.on('printer.setLineOverwrite', (payload) => {
    console.log('Setting line overwrite: ', payload.number);
  });
});

/**
 * Handle REPL Commands
 */
const defineReplCommands = () => {
  replServer.defineCommand('press', {
    help: 'Use this to simulate button press',
    action(rawColor) {
      this.bufferedCommand = '';
      let color = rawColor.toLowerCase();
      if(COLORS.includes(color)) {
        uiNamespace.emit('button.isPressed', {color});
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
      uiNamespace.emit('printer.isReady');
      this.displayPrompt();
    }
  });

  replServer.defineCommand('webcam', {
    help: "Update webcam filters",
    action(command) {
      command = command.split(" ");
      let filter = command[0];
      let action = command[1];

      this.bufferedCommand = '';
      if(filter === 'b') { filter = 'brightness'; }
      if(filter === 'c') { filter = 'contrast'; }
      if(filter !== 'brightness' && filter !== 'contrast') {
        console.error(`filter ${filter} not valid`);
        this.displayPrompt();
        return;
      }

      if(action === 'i') { action = 'increase'; }
      if(action === 'd') { action = 'decrease'; }
      if(action !== 'increase' && action !== 'decrease') {
        console.error(`action ${action} not valid`);
        this.displayPrompt();
        return;
      }

      uiNamespace.emit('webcam.updateFilter', {
        action,
        filter
      });
      this.displayPrompt();
    }
  });

  replServer.defineCommand('reload', {
    help: "Reload UI",
    action() {
      this.bufferedCommand = '';
      uiNamespace.emit('control.reload');
      this.displayPrompt();
    }
  });
};


const _displayButtons = (colors) => {
  const green = colors.green === 'high' ? 'x' : ' ';
  const red = colors.red === 'high' ? 'x' : ' ';
  const blue = colors.blue === 'high' ? 'x' : ' ';

  console.log('\n' + ` ${green} `.bgGreen + ' ' + ` ${red} `.bgRed + ' ' + ` ${blue} `.bgBlue);
  replServer.displayPrompt();
};

// init REPL comands
defineReplCommands();
// init server
server.listen(54321);