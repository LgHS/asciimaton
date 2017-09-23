// app.js
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const repl = require('repl');
const replServer = repl.start({
  prompt: "socketio-test > ",
});

app.use(express.static(__dirname + '/node_modules'));
app.get('/', function(req, res,next) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
  console.log('Client connected...');

  replServer.context.client = client;

  client.on('join', function (data) {
    console.log(data);
    client.emit('messages', 'Hello from server');
  });
});

server.listen(4200);