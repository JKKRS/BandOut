angular.module('main.goLive', [])
  .controller('GoLiveCtrl', GoLiveCtrl);

function GoLiveCtrl($scope, store, User, $cordovaGeolocation, $ionicModal, $ionicLoading, Artist, $window) {
  // check if current user is artist. ng-show functionality
  $scope.isArtist = function() {
    return store.get('artist');
  };

  // conditional title depending on user artist boolean
  $scope.title = function() {
    return $scope.isArtist() ? 'Go Live' : 'Live Artists';
  };

  // populate artists
  $scope.artists = Artist.query();

  // click handler to open artist paypal link
  $scope.payPal = function(link) {
    link = link.toString();
    $window.open(link, '_blank', 'location=yes');
  };

  // pull to refresh functionality
  $scope.refresh = function() {
    // re-populate artists list with new data
    Artist.query().$promise.then(function(allArtists) {
      // Stop the ion-refresher from spinning
      $scope.artists = allArtists;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };


  $scope.liveButton = false;

  // click handler --> artist goes live
  $scope.goLive = function() {
    $scope.liveButton = !$scope.liveButton;
    if ($scope.liveButton) {
      $ionicLoading.show();
      // get current user location
      $cordovaGeolocation.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: false
      }).then(function(pos) {
        // update current location in database. set live = true
        $scope.fbid = store.get('profile').user_id;
        $scope.coords = [pos.coords.longitude, pos.coords.latitude];
        User.update({
          'fbid': $scope.fbid
        }, {
          live: true,
          'location.coordinates': $scope.coords
        });
      });
    } else {
      // click handler --> artist stops broadcasting live
      // set live to false. reset location so location information not stored
      $scope.fbid = store.get('profile').user_id;
      User.update({
        'fbid': $scope.fbid
      }, {
        live: false,
        'location.coordinates': [0, 0]
      });
    }
  };
}
