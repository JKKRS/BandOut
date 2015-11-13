var express = require('express');
var User    = require('../database/models/user');

var UsersAPI = express.Router();

UsersAPI.get('/', function(req, res) {
  console.log('this is a GET on the / route');
  res.status(200).send('heyo')
})

module.exports = UsersAPI;