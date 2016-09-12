var fs = require('fs');
var path = require('path');
var http2 = require('http2');
var extractPush = require('./extract-push');

function pushFiles(response, toPush) {
  toPush.forEach((v) => {
    var push = response.push(v);
    push.writeHead(200);
    fs.createReadStream(path.join(__dirname, v)).pipe(push);
  });
}

function handleRoot(request, response) {
  response.setHeader('content-type', 'text/html');
  let indexPath = path.join(__dirname, '/static/index.html');

  if (response.push) {
    extractPush(
      fs.readFileSync(indexPath, 'utf8')).then((toPush) => {
        pushFiles(response, toPush);
      });
  }

  fs.createReadStream(indexPath).pipe(response);
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
