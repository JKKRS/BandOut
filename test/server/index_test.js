var request    = require('supertest-as-promised');
var routes     = require(__server + '/index.js');
var UsersAPI   = require(__server + '/apis/users-api');
var db         = require(__server + '/database/config');
var userModel  = require(__server + '/database/models/user');
var underscore = require('underscore');

var app = TestHelper.createApp()
app.use('/apis/users', UsersAPI)
app.use('/', routes)
app.testReady()

// Set up date for creating events
var date = new Date();

var User = function(fbid, name, image, email, twitter, artist) {
  var newUser = Object.create(Object.prototype);
  newUser = {
    "fbid" : fbid,
    "name" : name,
    "image" : image,
    "email" : email,
    "twitter" : twitter,
    "artist" : artist
  }
  return newUser;
}

var Venue = function(name, city, country, lat, longitude) {
  var newVenue = Object.create(Object.prototype)
  newVenue = {
    "name" : name,
    "city": city,
    "country" : country,
    "latitude" : lat,
    "longitude" : longitude
  }
  return newVenue;
}

var Event = function(id, title, datetime, description, venue) {
  var newEvent = Object.create(Object.prototype);
  newEvent = {
    "id" : id,
    "title" : title,
    "datetime" : datetime,
    "description" : description,
    "venue" : venue
  }
  return newEvent;
}

var Artist = function(user, events, paypal_link) {
  var newArtist = Object.create(User.prototype);
  newArtist = user;
  newArtist.artist_info = {
      "paypal_link" : paypal_link,
      upcoming_events : events
  }
  return newArtist;
}

var date = new Date();

// Set up dummy data
var user1 = User("123", "scott", "http://www.google.com/imageurl", "sschwa12@gmail.com", "@scott", false)
var user2 = User("456", "someone", "http://www.google.com/imageurl", "sschwa12@gmail.com", "@scott", false)
var user3 = User("789", "a guy", "http://www.google.com/imageurl", "sschwa12@gmail.com", "@scott", true)
var venue1 = Venue('Citi Field', 'Queens', 'USA', 1235, 12322);
var venue2 = Venue('Jones Beach', 'Wantagh', 'USA', 098244, 777655);
var event1 = Event(1, 'Awesome fest 2k15', date, 'An awesome festival', venue1);
var event2 = Event(2, 'Rock Fest 2k15', date, 'A Rockin festival', venue2);
var artist1 = Artist(user3, event1, 'http://linktopaypal')

var postUser = function(user) {
  return request(app)
  .post('/apis/users')
    .send(user)
    .expect(201)
}

describe("The Server", function() {

  before(function (done) {
      userModel.remove({}, function(err, rmd) {} )
      .then(done())
  });

  it('returns all users', function(done) {
    // userModel.remove({}, function(err, rmd) {})
    return request(app)
    .post('/apis/users')
      .send(user1)
      .expect(201)
      .then(function() {
        return request(app)
          .get('/apis/users')
          .expect(200)
        })
        .then(function(res, err) {
          // console.log(res.body)
          expect(res.body.length).to.equal(1)
          expect(res.body._id).to.equal(user1._id)
        })
      .then(done())
  });

  it("serves an example endpoint", function(done) {

    // Mocha will wait for returned promises to complete
    return request(app)
      .get('/api/tags-example')
      .expect(200)
      .then(function(response) {
        expect(response.body).to.include('node')
      })
      .then(done())
  });

  it("posts to the /apis/users endpoint", function(done) {
    return request(app)
      .post('/apis/users')
      .expect(201)
      .then(done())
  });

  it("creates a non-artist user and returns it", function(done) {
    return request(app)
      .post('/apis/users')
      .send(user1)
      .expect(201)
      .expect(function(response) {
          var returnedUser = response.body;

          expect(returnedUser._id).to.not.be.undefined;
          expect(returnedUser.name).to.equal(user1.name);
          expect(returnedUser.image).to.equal(user1.image);
          expect(returnedUser.email).to.equal(user1.email);
          expect(returnedUser.twitter).to.equal(user1.twitter);
          expect(returnedUser.artist).to.equal(user1.artist);

        })
      .then(done());
  });
})
