angular.module('starter.goLive', [])

.controller('GoLiveCtrl', function($scope, store, User, $cordovaGeolocation) {
  $scope.artistLive = function() {
    $cordovaGeolocation.getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: false
    }).then(function(pos) {
      $scope.fbid = store.get('profile').user_id.substr(9);
      $scope.coords = [pos.coords.longitude, pos.coords.latitude];
      User.update({
        'fbid': $scope.fbid
      }, {
        live: true,
        'location.coordinates': $scope.coords

      }).$promise.then(function() { console.log('user saved'); });
    });
  };
});
