angular.module('starter.goLive', [])

.controller('GoLiveCtrl', function($scope, store, User, $cordovaGeolocation, $ionicModal) {
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

      }).$promise.then(function() {
        $scope.openModal();
      });
    });
  };


  $scope.stopEvent = function() {
    $scope.fbid = store.get('profile').user_id.substr(9);
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
