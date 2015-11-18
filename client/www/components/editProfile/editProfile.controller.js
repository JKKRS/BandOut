angular.module('starter.editProfile', [])

.controller('editProfileCtrl', editProfileCtrl);

function editProfileCtrl($scope, $state, User, UserService) {
  $scope.user = {};
  $scope.user.artist = false;
  $scope.user.name = "";
  $scope.user.email = "";
  $scope.user.twitter = "";
  $scope.user.paypal = "";
  $scope.user.website = "";
  $scope.create = function() {
    $state.go('app.editProfile.addEvent');
  };

  $scope.retrieveUser = function() {
    UserService.getUser()
    .then(function(res) {
      console.log('called', res);
      $scope.user.name = res.name;
      $scope.user.email = res.email;
      $scope.user.twitter = res.twitter;
      $scope.user.artist = res.artist;
      $scope.user.paypal = res.artist_info.paypal_link;
      $scope.user.website = res.artist_info.website;
    });
  }

  $scope.saveUser = function() {
    var user = NewUser($scope.user.artist, $scope.user.twitter, $scope.user.paypal, $scope.user.website)
    console.log(user)
    User.update({ "fbid" : "10101731679332720" }, user);
  }

  $scope.retrieveUser();
}

var NewUser = function(artist, twitter, pp_id, website) {
  var newUser = Object.create(Object.prototype);
  newUser = {
    "artist" : artist,
    "twitter" : twitter,
    "artist_info" : {},
  }
  newUser.artist_info.website = website;
  newUser.artist_info.paypal_link = pp_id;
  return newUser;
}
// var Venue = function(name, city, country, lat, longitude) {
//   var newVenue = Object.create(Object.prototype)
//   newVenue = {
//     "name" : name,
//     "city": city,
//     "country" : country,
//     "latitude" : lat,
//     "longitude" : longitude
//   }
//   return newVenue;
// }

// var Event = function(id, title, datetime, description, venue) {
//   var newEvent = Object.create(Object.prototype);
//   newEvent = {
//     "id" : id,
//     "title" : title,
//     "datetime" : datetime,
//     "description" : description,
//     "venue" : venue
//   }
//   return newEvent;
// }
