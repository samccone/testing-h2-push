var fs = require('fs');
var path = require('path');
var http = require('http');
var extractPush = require('./extract-push');

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

  if (request.url === '/') {
    indexPath = path.join(__dirname, 'pages/index.html');
  }

  let pushFiles = extractPush(fs.readFileSync(indexPath, 'utf8')).then(toPush => {
    response.setHeader('link', toPush.map(v => `<${v}>; rel=preload`));
  }).then(() => {
    fs.createReadStream(indexPath).pipe(response);
  }).catch(e => console.log(e));
}

function onRequest(request, response) {
  console.log(`request ${request.url}`);
  if (request.url === '/' || request.url.endsWith('.html')) {
    handleDocument(request, response);
  }
}

server = http.createServer(onRequest);

server.listen(3000);
console.log('server started on port 3000');
