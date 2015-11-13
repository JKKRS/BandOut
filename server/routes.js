var express       = require('express');
var Path          = require('path');

// Routers
var routes        = express.Router();
var userRouter    = require('./apis/users-api');
var assetFolder   = Path.resolve(__dirname, '../client/');

module.exports = function(app) {
  app.use('/apis/users', userRouter);


  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  app.get('/*', function(req, res){
    res.sendFile( assetFolder + '/www/index.html' );
  });
}