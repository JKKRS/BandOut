angular.module('main.fbLogin', ['main.services'])

.controller('LoginCtrl', LoginCtrl)
.config(function($stateProvider) {
  $stateProvider
  .state('login', {
    url: '/',
    templateUrl: 'components/login/login.html',
    controller: 'LoginCtrl',
    data: {
      requiresLogin: false
    }
  });
});

function LoginCtrl($scope, $state, $q, $location, UserService, DeviceService, User, $ionicLoading, store, auth) {

  // Success callback for login
  var loginSuccess = function(profile, token, accessToken, state, refreshToken) {
    // Success callback
    profile.user_id = profile.user_id.substr(9);
    var device_id = store.get('device_token');
    DeviceService.setDevice({device_id: device_id});
    UserService.setUser(profile).then(function(user) {
      store.set('userData', user);
      store.set('artist', store.get('userData').artist);
      $state.go('app.artists.index');
    });
    store.set('profile', profile);
    store.set('token', token);
    store.set('refreshToken', refreshToken);
  };

  // Failure callback for login
  function loginError(error) {
    console.log('Login Error', error);
    $ionicLoading.hide();
  }

  // Method to execute on Login button click
  $scope.login = function() {
    auth.signin({
      closable: true,
      container: 'login',
      connections: ['facebook'],
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile device'
      }
    }, loginSuccess, loginError);
  };
}
