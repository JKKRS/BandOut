angular.module('starter.goLive', [])

.controller('GoLiveCtrl', function($scope, store, User, $cordovaGeolocation, $ionicModal, $ionicLoading) {
  $scope.isArtist = function() {
    return store.get('artist');
  }
  $scope.artistLive = function() {
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

      }).$promise.then(function() {
        $ionicLoading.hide();
        $scope.openModal();
      });
    });
  };


  $scope.stopEvent = function() {
    $scope.fbid = store.get('profile').user_id;
    User.update({
      'fbid': $scope.fbid
    }, {
      live: false,
      'location.coordinates': [0,0]
   }).$promise.then(function() {
    $scope.closeModal();
   });
  };

  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // //Cleanup the modal when we're done with it!
  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });
  // // Execute action on hide modal
  // $scope.$on('modal.hidden', function() {
  //   // Execute action
  // });
  // // Execute action on remove modal
  // $scope.$on('modal.removed', function() {
  //   // Execute action
  // });
});
