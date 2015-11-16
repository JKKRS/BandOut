var express = require('express');
var mongoose = require('../database/config');
var User    = require('../database/models/user');

var UsersAPI = express.Router();

UsersAPI.post('/', function(req, res) {
  var newUser = new User(req.body);
  newUser.save(function(err, user) {
    if (err) { return err; }
    res.status(201).send(user);
  });
});

UsersAPI.get('/', function(req, res) {
  User.find({ artist : false }, function(err, user) {
    if (err) { return err; }
    res.status(200).send(user);
  });
});

UsersAPI.get('/:id', function(req, res) {
  var id = req.params.id;
  User.findOne({ fbid : id, artist : false }, function(err, user) {
    if (err) { return err; }
    res.status(200).send(user);
  });
});

UsersAPI.put('/:id', function(req, res) {
  var id = req.params.id;
  User.update( { fbid : id }, { $set : req.body }, null, function(err, msg) {
    if (err) { return err; }
    res.status(202).send(msg);
  });
});

module.exports = UsersAPI;
