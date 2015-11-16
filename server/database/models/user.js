var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  auth_info : {
    accessToken: String,
    expiresIn: Number,
    signedRequest: String
  },
  fbid: { type : String, unique : true, required : true },
  name: { type : String, required : true },
  image: String,
  email: String,
  twitter: String,
  artist: Boolean,
  artist_info: {
    paypal_link: String,
    upcoming_events: [{
      id: Number,
      title: String,
      datetime: Date,
      description: String,
      venue: {
        name: String,
        city: String,
        country: String,
        latitude: Number,
        longitude: Number
      }
    }]
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;

// GET  /users/all     -> returns all users in array
// GET  /users/artists -> returns all users with .artist === true
// GET  /users/:id     -> returns single user where :id === _id
// POST /users         -> expects an {} to be sent with attributes in schema
