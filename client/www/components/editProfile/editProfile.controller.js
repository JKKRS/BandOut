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
    UserService.getUser().then(function(res) {
      console.log('res', res)
      $scope.user.name = res.name;
      $scope.user.email = res.email;
      $scope.user.twitter = res.twitter;
      $scope.user.artist = res.artist;
    });
  }

  $scope.saveUser = function() {
    console.log($scope.user)
    var user = NewUser($scope.user.artist, $scope.user.twitter, $scope.user.paypal, $scope.user.website)
    User.update({ "fbid" : "10101731679332720" }, user);
  }

  $scope.retrieveUser();
}

var NewUser = function(artist, twitter, pp_id, website) {
  var newUser = Object.create(Object.prototype);
  newUser = {
    "artist" : artist,
    "twitter" : twitter,
    "paypal_id" : pp_id,
    "website" : website
  }
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
