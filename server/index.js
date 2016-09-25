var fs = require('fs');
var path = require('path');
var http = require('http');
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
  let pushFiles = extractPush(
    fs.readFileSync(indexPath, 'utf8')).then((toPush) => {
      pushFiles(response, toPush);
    });

  console.log('should-push');
  fs.createReadStream(indexPath).pipe(response);
}

function handleStatic(request, response) {
  if (request.url === '/') {
    response.setHeader('content-type', 'text/html');
    fs.createReadStream(path.join(__dirname, '/static/index.html')).pipe(response);
    return;
  }

  response.writeHead(404);
  response.end();
}

function onRequest(request, response) {
  console.log(`request ${request.url}`);
  if (request.url.endsWith('.html')) {
    fn(request, response);
  }
}

server = http.createServer(onRequest);

server.listen(3000);
console.log('server started on port 3000');
