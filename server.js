var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');
var https = require('https');
var ssl = require('./ssl_option');

var PORT = 44300;
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
    }).pipe(res); 
  } else {
      request({
      method:method,
      url:url, 
    }).pipe(res); 
  }
}

var path = {
  'attendance':'http://localhost:44301',
  'newindicator':'http://localhost:44302'
};

app.all('/dbs/:db/:id?', function(req,res) {
  if(path[req.params.db]){
    var db_url = path[req.params.db]+'/data';
    if(req.params.id) {
      db_url += '/'+req.params.id;
    }
    pipe_request(req.method,db_url,req,res);
  }else{
    res.json({
      'ok': false,
      'message': err
    });
  }
});

app.get('/log/:db', function(req,res) {
  if(path[req.params.db]){
    var db_url = path[req.params.db]+'/log';
    pipe_request(req.method,db_url,req,res);
  }else{
    res.json({
      'ok': false,
      'message': err
    });
  }
});

app.get('/compactlog/:db', function(req,res) {
  if(path[req.params.db]){
    var db_url = path[req.params.db]+'/compact';
    pipe_request(req.method,db_url,req,res);
  }else{
    res.json({
      'ok': false,
      'message': err
    });
  }
});

app.post('/query/:db/:index', function(req,res) {
  if(path[req.params.db]){
    var db_url = path[req.params.db]+'/query/'+req.params.index;
    pipe_request(req.method,db_url,req,res);
  }else{
    res.json({
      'ok': false,
      'message': err
    });
  }
});

app.post('/sync/:db', function(req,res) {
  if(path[req.params.db]){
    var db_url = path[req.params.db]+'/sync';
    pipe_request(req.method,db_url,req,res);
  }else{
    res.json({
      'ok': false,
      'message': err
    });
  }
});
/*
app.listen(PORT, function () {
  console.log('Server listening on port %d', this.address().port);
});
*/

https.createServer(ssl.options, app).listen(PORT, null, function () {
  console.log('Server listening on port %d', this.address().port);
});
