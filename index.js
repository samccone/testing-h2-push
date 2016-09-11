var fs = require('fs');
var path = require('path');
var http2 = require('http2');

function pushFiles(response) {
  var push = response.push('/static/sample.js');
  push.writeHead(200);
  fs.createReadStream(path.join(__dirname, '/static/sample.js')).pipe(push);
}

function handleRoot(request, response) {
  response.setHeader('content-type', 'text/html');

  if (response.push) {
    pushFiles(response);
  }


  fs.createReadStream(
    path.join(__dirname, '/static/index.html')).pipe(response);
}

function onRequest(request, response) {
  switch(request.url) {
    case '':
    case '/':
      handleRoot(request, response);
      break;
    default:
      response.writeHead(404);
      response.end();
  }
}

server = http2.createServer({
  key: fs.readFileSync(path.join(__dirname, '/server.key')),
  cert: fs.readFileSync(path.join(__dirname, '/server.crt'))
}, onRequest);

server.listen(3000);
