### Testing h2 push

### Setup

* install https://h2o.examp1e.net/install.html
* self sign a cert in the server dir (follow https://devcenter.heroku.com/articles/ssl-certificate-self)

### Running

Boot the h2 server
`./start-server.sh`

Boot the node server
`node server/index.js`

visit https://localhost
