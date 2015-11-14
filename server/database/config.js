var mongoose = require('mongoose');

// TODO: setup local test DB

var config = {
  mongoUrl: process.env.MONGOLAB_URI || 'mongodb://localhost/bandout'
};

mongoose.connect(config.mongoUrl);

mongoose.connection.on('error', function(err){
  console.log('Mango problem', err)
})

module.exports = mongoose;
