//if (!require("piping")({ignore: /(test\/.*\._coffee|.*\.un$|.*\.xml$|.*\.md$|.*\.json$|\.git\/.*|\.idea\/.*)/})) return;

//Add log shortcut
global.log = console.log.bind(console);

//Common modules
var bodyParser = require('body-parser');
var express = require('express');

//Get queue instance
var queue = require('./lib/queue');

//Initialize Express and middleware
var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

//Set up routes
app.get('/api/colors/fetch', function(req, res, next){
    res.json(queue.fetchColor());
});
app.post('/api/colors/set/:colorId', function(req, res, next){
    queue.setColor(req.params.colorId);
    res.status(200).end();
});

//Start server
var port = (process.env.PORT || 8321);
app.listen(port, function(){
    log('listening on '+port+'...');
});