angular.module('starter.editProfile', [])

.controller('editProfileCtrl', editProfileCtrl);

function editProfileCtrl($scope, $state, User, UserService, $timeout) {
  // Default user values
  $scope.user = {};
  $scope.user.artist = false;
  $scope.user.name = "";
  $scope.user.email = "";
  $scope.user.twitter = "";
  $scope.user.paypal = "";
  $scope.user.website = "";
  $scope.user.fbid = "";

  // $scope.$watchGroup(['user.paypal', 'user.twitter', 'user.website', 'user.artist'], function(newVal, oldVal, scope) {
  //     if ($scope.initialLoad) {
  //       $scope.initialLoad = false;
  //     } else {
  //       $scope.disableSave = false;
  //     }
  // });

  $scope.create = function() {
    $state.go('app.editProfile.addEvent', {user: $scope.user});
  };

  // Get the current logged in user using FB.getLoginStatus(); and set scope vars
  $scope.retrieveUser = function() {
    UserService.getUser()
    .then(function(res) {
      // Strip the beginning of the paypal URL
      var url = res.artist_info.paypal_link;
      var index = url.lastIndexOf('/');
      var pp_id = url.substr(index + 1)

      $scope.user.name = res.name;
      $scope.user.email = res.email;
      $scope.user.twitter = res.twitter;
      $scope.user.artist = res.artist;
      $scope.user.paypal = pp_id;
      $scope.user.website = res.artist_info.website;
      $scope.user.fbid = res.fbid;
    }).then(function() {
      // $scope.disableSave = true;
      // $scope.initialLoad = true;
    });
  };

  // not currently being used, but can be used to validate on field update / change
  // $scope.validate = function() {
  //   if (/^[a-zA-Z0-9]+$/.test($scope.user.paypal) === false) {
  //     $scope.disableSave = true;
  //   }
  // }

  // Create new user from scope vars, and submit PUT request to server using fbid
  // to search for user in db
  $scope.saveUser = function() {
    // Append url to paypal ID
    var paypal = 'https://paypal.me/' + $scope.user.paypal;
    var user = NewUser(
        $scope.user.artist,
        $scope.user.twitter,
        paypal,
        $scope.user.website
      );
    User.update({ "fbid" : $scope.user.fbid }, user);
    $scope.disableSave = true;
  };

  $scope.retrieveUser();
}

// Constructor function to create new users
var NewUser = function(artist, twitter, pp_id, website) {
  var newUser = Object.create(Object.prototype);
  newUser = {
    "artist" : artist,
    "twitter" : twitter,
    "artist_info" : {},
  };
  newUser.artist_info.website = website;
  newUser.artist_info.paypal_link = pp_id;
  return newUser;
};
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
