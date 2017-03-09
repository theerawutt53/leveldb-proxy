var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');
var https = require('https');
var ssl = require('./ssl_option');

var PORT = 80;
var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {  
  res.send('Hello World!')
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

var SubPath = {
  'dbs':['/:id?','/data'],
  'log':['','/log'],
  'compactlog':['','/compact'],
  'query':['/:index','/query'],
};

var Path = {
  'user_db':'http://localhost:8000',
  'obec_students':'http://localhost:8001',
  'form_record':'http://localhost:8002'
};

for(var KeyPath in Path){
  for(var keySubPath in SubPath){
    var Select = '/'+keySubPath+'/'+KeyPath+SubPath[keySubPath][0];
    
    app.get(Select, function(req, res) {
      var last_url = req.url.split("/");
      var _path = '';
      if(last_url.length == 4){
        _path = SubPath[last_url[1]][1]+'/'+last_url[3];
      }else{
        _path = SubPath[last_url[1]][1];
      }
      var url = 'http://localhost:8000'+_path; 
      pipe_request('GET',url,req,res);
    });
  }
}

app.listen(PORT, function () {
  console.log('Server listening on port %d', this.address().port);
});

/*
https.createServer(ssl.options, app).listen(PORT, HOST, null, function () {
  console.log('Server listening on port %d', this.address().port);
});
*/