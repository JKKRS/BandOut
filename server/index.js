var express  = require('express');
var Path     = require('path');
var routes   = express.Router();
var sessions = require('./routes/sessions');
var morgan   = require('morgan');

if(process.env.NODE_ENV !== 'test') {

  // We're in development or production mode;
  // create and run a real server.
  var app = express();

  app.all('*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
  });

  require('./routes.js')(app);

  // Morgan for logging server requests
  app.use(morgan('dev'));

  // Parse incoming request bodies as JSON
  app.use( require('body-parser').json() );

  // Start the server!
  var port = process.env.PORT || 5000;
  app.listen(port);
  console.log("Listening on port", port);
} else {
  // We're in test mode; make this file importable instead.
  routes.get('/api/tags-example', function(req, res) {
    res.send(['node', 'express', 'angular']);
  });

  module.exports = routes;
}
