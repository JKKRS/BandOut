angular.module('starter.fbLogin', ['starter.services'])

.controller('LoginCtrl', function($scope, $state, $q, $location, UserService, User, $ionicLoading, store, auth) {

  // Success callback for login
  var loginSuccess = function(profile, token, accessToken, state, refreshToken) {
    // Success callback
    profile.user_id = profile.user_id.substr(9);
    UserService.setUser(profile).then(function(user) {
      store.set('userData', user);
      store.set('artist', store.get('userData').artist);
      $state.go('app.artists.index');
    });
    console.log('Login profile:', profile);
    store.set('profile', profile);
    store.set('token', token);
    store.set('refreshToken', refreshToken);
    console.log('Login Success');
  };

  // Failure callback for login
  function loginError(error) {
    console.log('Login Error', error);
    $ionicLoading.hide();
  }

  // Method to execute on Login button click
  $scope.login = function() {
    auth.signin({
      popup: true,
      container: 'login',
      connections: ['facebook'],
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile device'
      }
    }, loginSuccess, loginError);
  };
});
