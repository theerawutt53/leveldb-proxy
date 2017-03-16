var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');
var https = require('https');
var config = require('./config');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {  
  res.send('Hello World!');
})

var pipe_request = function(method,url,req,res) {
  var jwt = req.headers.authorization;
  if(req.body) {
    request({
      method:method,
      url:url,
      headers:{'Authorization':jwt},
      qs:req.query,
      json:true,
      body:req.body
    })
    .on('error', function(err) {
      res.json({
        'ok': false,
        'message':err
      });
    })
    .pipe(res)
  } else {
      request({
      method:method,
      url:url, 
    }).pipe(res); 
  }
}

app.param('db',function(req,res,next,db) {
  if(!config.path[db]) {
    res.json({
      'ok': false,
      'message': 'Database not found'
    });
  } else {
    next();
  }
});

app.all('/dbs/:db/:id?', function(req,res) {
  var db_url = config.path[req.params.db]+'/data';
  if(req.params.id) {
    db_url += '/'+req.params.id;
  }
  pipe_request(req.method,db_url,req,res);
});

app.get('/log/:db', function(req,res) {  
  var db_url = config.path[req.params.db]+'/log';
  pipe_request(req.method,db_url,req,res);
});

app.get('/compactlog/:db', function(req,res) {
  var db_url = config.path[req.params.db]+'/compact';
  pipe_request(req.method,db_url,req,res);
});

app.post('/query/:db/:index', function(req,res) {
  var db_url = config.path[req.params.db]+'/query/'+req.params.index;
  pipe_request(req.method,db_url,req,res);
});

app.post('/sync/:db', function(req,res) {
  var db_url = config.path[req.params.db]+'/sync';
  pipe_request(req.method,db_url,req,res);
});

app.listen(config.port, function () {
  console.log('Server listening on port %d', this.address().port);
});

/*
https.createServer(config.ssl_options, app).listen(config.port, null, function () {
  console.log('Server listening on port %d', this.address().port);
});
*/