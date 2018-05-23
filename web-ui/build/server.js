const path = require('path');
const express = require('express');
const app = express();

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.listen(8000, 'localhost');
console.log(`Listening on localhost:8000`);
