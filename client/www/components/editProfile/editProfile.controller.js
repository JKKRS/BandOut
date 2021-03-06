angular.module('main.editProfile', ['main.services'])

.controller('editProfileCtrl', editProfileCtrl)
.config(function($stateProvider) {
  $stateProvider
  .state('app.editProfile', {
    url: '/editProfile',
    abstract: true,
    views: {
      'editProfile': {
        template: '<ion-nav-view></ion-nav-view>'
      }
    },
    data: {
      requiresLogin: true
    }
  })
  .state('app.editProfile.index', {
    url: '',
    templateUrl: 'components/editProfile/editProfile.html',
    controller: 'editProfileCtrl'
  })

  .state('app.editProfile.editEvent-addEvent', {
    url: '/addEvent',
    params: {user: null},
    templateUrl: 'components/addEvent/addEvent.html',
    controller: 'addEventCtrl'
  })

  .state('app.editProfile.yourEvents', {
    url:'/editEvent',
    params:{user: null},
    templateUrl: 'components/yourEvents/yourEvents.html',
    controller:'yourEventsCtrl'
  })

  .state('app.editProfile.editEvent-editEvent', {
    url: '/:eventId',
    params: {event: null, eventId: null},
    templateUrl: 'components/editEvent/editEvent.html',
    controller: 'editEventCtrl'
  });
});

function editProfileCtrl($scope, $state, User, UserService, store) {

  $scope.user = store.get('userData');


  // Strip the beginning of the paypal URL
  if ($scope.user.artist_info) {
    var url = $scope.user.artist_info.paypal_link;
    if (url) {
      var index = url.lastIndexOf('/');
      var pp_id = url.substr(index + 1);
      $scope.user.artist_info.paypal_link = pp_id;
    }
  }

  $scope.initialState = [
    $scope.user.artist_info.artist_name,
    $scope.user.artist_info.paypal_link,
    $scope.user.twitter,
    $scope.user.artist_info.website,
    $scope.user.artist
  ];

  $scope.disableSave = true;
  $scope.initialLoad = true;


  // Watch these fields for changes, disable save if nothing has changed
  $scope.$watchGroup([
    'user.artist_info.artist_name',
    'user.artist_info.paypal_link',
    'user.twitter',
    'user.artist_info.website',
    'user.artist'
    ], function(newVal, oldVal, scope) {
      if ($scope.initialLoad === true) {
        $scope.initialLoad = false;
      } else if (_.isEqual($scope.initialState, newVal)) {
        $scope.disableSave = true;
      } else {
        $scope.disableSave = false;
      }
  });

  // Create new user from scope vars, and submit PUT request to server
  $scope.saveUser = function() {

    var paypal = 'https://paypal.me/' + $scope.user.artist_info.paypal_link;

    var user = NewUser(
      $scope.user.artist,
      $scope.user.artist_info.artist_name,
      $scope.user.twitter,
      paypal,
      $scope.user.artist_info.website,
      $scope.user.artist_info.upcoming_events
    );

    User.update({ 'fbid' : $scope.user.fbid }, user);

    $scope.disableSave = true;
    store.set('artist', $scope.user.artist);
    $scope.initialState = [
      $scope.user.artist_info.paypal_link,
      $scope.user.twitter,
      $scope.user.artist_info.website,
      $scope.user.artist
    ];
  };

  // Go to the 'your events' screen
  $scope.editEvent = function() {
    $state.go('app.editProfile.yourEvents', {
      user: $scope.user
    });
  };

  // Track whether user has toggled 'artist' or not
  $scope.toggleArtist = function() {
    var current = $scope.user.artist;
    $scope.user.artist = !current;
  };
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
