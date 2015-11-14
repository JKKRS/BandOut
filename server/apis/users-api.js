var express = require('express');
var mongoose = require('../database/config');
var User    = require('../database/models/user');

var UsersAPI = express.Router();

UsersAPI.post('/', function(req, res) {
  var newUser = new User(req.body);
  newUser.save(function(err, user) {
    if (err) { return err }
    res.status(201).send(user);
  })
})

UsersAPI.get('/', function(req, res) {
  User.find({}, function(err, user) {
    if (err) { return err }
    res.status(200).send(user);
  })
})

module.exports = UsersAPI;