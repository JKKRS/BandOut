var express = require('express');
var mongoose = require('../database/config');
var User    = require('../database/models/user');

var ArtistsAPI = express.Router();

ArtistsAPI.post('/', function(req, res) {
  var newArtist = new User(req.body);
  newArtist.save(function(err, artist) {
    if (err) { return err; }
      res.status(201).send(artist);
  });
});

ArtistsAPI.get('/', function(req, res) {
  User.find({ artist : true }, function(err, artist) {
    if (err) { return err; }
      res.status(200).send(artist);
  });
});

ArtistsAPI.get('/:id', function(req, res) {
  var id = req.params.id;
  User.findOne({ fbid : id, artist : true }, function(err, artist) {
    if (err) { return err; }
    res.status(200).send(artist);
  });
});

ArtistsAPI.put('/:id', function(req, res) {
  var id = req.params.id;
  User.update( { fbid : id }, { $set : req.body }, null, function(err, msg) {
    if (err) { return err; }
    res.status(202).send(msg);
  });
});

module.exports = ArtistsAPI;
