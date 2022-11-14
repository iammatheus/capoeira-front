const express = require('express');
const path = require('path');
const app = express();

const appName = 'frontend';
const directory = __dirname + `/dist/${appName}`;

app.use(express.static(directory))

app.get('/*', function(req, res) {
  res.sendFile(path.join(directory + '/index.html'))
});

app.listen(process.env.PORT || 3000);
