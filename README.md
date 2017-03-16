# leveldb-proxy
leveldb-proxy
```sh
var path = require('path');
var fs = require('fs');

var certsPath = path.join(__dirname, 'ssl_certificate', 'server');
var caCertsPath = path.join(__dirname, 'ssl_certificate', 'ca');

module.exports.port = 44300;

module.exports.path = {
  'test1':'http://localhost:44301',
  'test2':'http://localhost:44302'
};

module.exports.ssl_options = {
  /*---ssl certificate---*/
  key: fs.readFileSync(path.join(certsPath, 'server.key')),
  cert: fs.readFileSync(path.join(certsPath, 'server.crt')),
  ca: fs.readFileSync(path.join(caCertsPath, 'ca.crt')),
  requestCert: false,
  rejectUnauthorized: true
  /*---ssl certificate---*/
};
```