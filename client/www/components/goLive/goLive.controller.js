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
      $cordovaGeolocation.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: false
      }).then(function(pos) {
        $scope.fbid = store.get('profile').user_id;
        $scope.coords = [pos.coords.longitude, pos.coords.latitude];
        console.log($scope.coords);
        User.update({
          'fbid': $scope.fbid
        }, {
          live: true,
          'location.coordinates': $scope.coords
        });
        // .$promise.then(function() {
        // $ionicLoading.hide();
        // $scope.openModal();
        // });
      });
    } else {
      // click handler --> artist stops broadcasting live
      $scope.fbid = store.get('profile').user_id;
      User.update({
        'fbid': $scope.fbid
      }, {
        live: false,
        'location.coordinates': [0, 0]
      });
      // .$promise.then(function() {
      // $scope.closeModal();
      //  });
    }
  };
}
