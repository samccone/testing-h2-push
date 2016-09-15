const lighthouse = require('lighthouse');
const path = require('path');
const fs = require('fs');
const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'runner.json'), 'utf8'));

lighthouse('https://localhost:3000/static/push-simple.html', {
      loadPage: true,
    },
    config).then(console.log.bind(console));
