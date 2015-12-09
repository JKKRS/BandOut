angular.module('main.goLive', [])
  .controller('GoLiveCtrl', GoLiveCtrl);

function GoLiveCtrl($scope, store, User, $cordovaGeolocation, $ionicModal, $ionicLoading) {
  // check if current user is artist. ng-show functionality
  $scope.isArtist = function() {
    return store.get('artist');
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
        console.log($scope.coords);
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
