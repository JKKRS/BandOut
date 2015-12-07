angular.module('main.menu', ['main.services'])
.controller('MenuCtrl', MenuCtrl);

function MenuCtrl($scope, $state, store, auth, $ionicPopup, UserService, $ionicLoading) {

  $scope.isArtist = function() {
    return store.get('artist');
  };
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

        auth.signout();
        store.remove('profile');
        store.remove('token');
        store.remove('artist');
        $ionicLoading.hide();
        $state.go('login');
        console.log("You are logged out!");
      } else {
        // cancel logout
      }
    });
  };
}
