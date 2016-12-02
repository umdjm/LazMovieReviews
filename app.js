var express = require('express');
var path = require('path');
var app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'));

app.get('/*', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

module.exports = app;
