var mongoose = require('mongoose');

// TODO: setup local test DB

var config = {
  mongoUrl: process.env.MONGOLAB_URI || 'mongodb://localhost/bandout'
};

mongoose.connect(config.mongoUrl);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  console.log('connected to mongo');
});

module.exports = mongoose;
