angular.module('main.editProfile', ['main.services'])

.controller('editProfileCtrl', editProfileCtrl);

function editProfileCtrl($scope, $state, User, UserService, store) {
  // Default user values
  $scope.user = {};
  $scope.initialLoad = true;

  // Watch these fields for changes, disable save if nothing has changed
  $scope.$watchGroup(['user.artist_name', 'user.paypal', 'user.twitter', 'user.website', 'user.artist'], function(newVal, oldVal, scope) {
      if ($scope.initialLoad === true) {
        $scope.initialLoad = false;
      } else if (JSON.stringify($scope.initialState) !== JSON.stringify(newVal)) {
        $scope.disableSave = false;
      } else {
        $scope.disableSave = true;
      }
  });

  // When state changes, re-fetch data (used for updating newly added shows)
  $scope.$on('$stateChangeSuccess',
  function(event, toState, toParams, fromState, fromParams) {
    $scope.retrieveUser();
  });

  // Get the current logged in user using FB.getLoginStatus(); and set scope vars
  $scope.retrieveUser = function() {
    UserService.getUser()
    .then(function(res) {
      var pp_id, url, website, upcoming;
      // Strip the beginning of the paypal URL
      // as long as the url exists

      if (res.artist_info) {
        artist_name = res.artist_info.artist_name;
        url = res.artist_info.paypal_link;
        website = res.artist_info.website;
        upcoming = res.artist_info.upcoming_events;
        if (url) {
          var index = url.lastIndexOf('/');
          pp_id = url.substr(index + 1);
        }
      }

      // Update scope variables with info from server
      $scope.user.name = res.name;
      $scope.user.email = res.email;
      $scope.user.artist_name = artist_name;
      $scope.user.twitter = res.twitter;
      $scope.user.artist = res.artist;
      $scope.user.paypal = pp_id;
      $scope.user.website = website;
      $scope.user.fbid = res.fbid;
      $scope.user.upcoming_events = upcoming;
    }).then(function() {
      $scope.disableSave = true;
      if ($scope.user.website === undefined) {
        $scope.user.website = '';
      }
      $scope.initialState = [$scope.user.artist_name, $scope.user.paypal, $scope.user.twitter, $scope.user.website, $scope.user.artist];
    });
  };

  // Create new user from scope vars, and submit PUT request to server
  $scope.saveUser = function() {
    // Append url to paypal ID
    var paypal = 'https://paypal.me/' + $scope.user.paypal;
    var user = NewUser(
        $scope.user.artist,
        $scope.user.artist_name,
        $scope.user.twitter,
        paypal,
        $scope.user.website,
        $scope.user.upcoming_events
      );
    User.update({ 'fbid' : $scope.user.fbid }, user);
    $scope.disableSave = true;
    store.set('artist', $scope.user.artist);
    $scope.initialState = [$scope.user.paypal, $scope.user.twitter, $scope.user.website, $scope.user.artist];
  };

  $scope.editEvent = function() {
    $state.go('app.editProfile.yourEvents', {
      user: $scope.user
    });
  };

  $scope.toggleArtist = function() {
    var current = $scope.user.artist;
    $scope.user.artist = !current;
  };


  $scope.retrieveUser();
}

// Constructor function to create new users
var NewUser = function(artist, artist_name, twitter, pp_id, website, upcoming_events) {
  var newUser = Object.create(Object.prototype);
  newUser = {
    'artist' : artist,
    'twitter' : twitter,
    'artist_info' : {},
  };
  newUser.artist_info.artist_name = artist_name;
  newUser.artist_info.website = website;
  newUser.artist_info.paypal_link = pp_id;
  newUser.artist_info.upcoming_events = upcoming_events;
  return newUser;
};
