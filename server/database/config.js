var mongoose = require('mongoose');
// var privateVars = require('../../.env');

var config = {
  mongoUrl: process.env.MONGO_COMPOSE_URI ||
    process.env.NODE_ENV === 'test' ? 'mongodb://localhost/bandout' : require('../../.env').MONGO_COMPOSE_URI
};

mongoose.connect(config.mongoUrl);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  //console.log('connected to mongo');
});

module.exports = mongoose;
