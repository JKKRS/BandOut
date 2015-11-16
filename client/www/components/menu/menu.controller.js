angular.module('starter.menu', ['starter.services'])

.controller('MenuCtrl', function($scope, $state, $ionicPopup, UserService, $ionicLoading, FACEBOOK_APP_ID) {
  $scope.user = UserService.getUser();
  // Logout Methods
  $scope.showConfirmLogOut = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Logout',
      template: 'Are you sure you want to logout?'
    });
    confirmPopup.then(function(res) {
      if (res) {
        // logout
        $ionicLoading.show({
          template: 'Logging out...'
        });

        if (!window.cordova) {
          // we are in browser
          facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
        }

        facebookConnectPlugin.logout(function() {
          // logout success
          $ionicLoading.hide();
          $state.go('login');
        }, function(fail) {
          $ionicLoading.hid();
        });
      } else {
        // cancel logout
      }
    });
  };
});
