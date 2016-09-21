var fs = require('fs');
var path = require('path');
var http2 = require('http2');
var extractPush = require('./extract-push');
var staticPrefix = 'static';

function pushFiles(response, toPush) {
  toPush.forEach((v) => {
    var push = response.push(v);
    push.writeHead(200);
    fs.createReadStream(path.join(__dirname, v)).pipe(push);
  });
}

function handleDocument(request, response) {
  response.setHeader('content-type', 'text/html');
  let indexPath = path.join(__dirname, request.url);

  if (response.push) {
    extractPush(
      fs.readFileSync(indexPath, 'utf8')).then((toPush) => {
        pushFiles(response, toPush);
      });
  }

  fs.createReadStream(indexPath).pipe(response);
}

function handleStatic(request, response) {
  if (request.url === '/') {
    response.setHeader('content-type', 'text/html');
    fs.createReadStream(path.join(__dirname, '/static/index.html')).pipe(response);
    return;
  }

  if (request.url.startsWith('/static/')) {
    fs.createReadStream(path.join(__dirname, request.url)).pipe(response);
    return;
  }

  response.writeHead(404);
  response.end();
}

function onRequest(request, response) {
  let fn = request.url.endsWith('.html') ? handleDocument : handleStatic;
  fn(request, response);
}

server = http2.createServer({
  key: fs.readFileSync(path.join(__dirname, '/server.key')),
  cert: fs.readFileSync(path.join(__dirname, '/server.crt'))
}, onRequest);

server.listen(3000);
