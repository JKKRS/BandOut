var express = require('express');
var User    = require('../database/models/user');

var UsersAPI = express.Router();

UsersAPI.post('/', function(req, res) {
  console.log('this is a POST to /')
  res.status(201).send('201 user created')
})

UsersAPI.get('/', function(req, res) {
  console.log('this is a GET on the / route');
  res.status(200).send('heyo')
})

module.exports = UsersAPI;