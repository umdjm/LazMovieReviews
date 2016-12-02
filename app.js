var express = require('express');
var path = require('path');
var index = require('./routes/index');
var app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

module.exports = app;
