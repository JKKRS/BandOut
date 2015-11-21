angular.module('starter.fbLogin', ['starter.services'])

.controller('LoginCtrl', function($scope, $state, $q, $location, UserService, User, $ionicLoading, FACEBOOK_APP_ID, store, auth) {

  // Success callback for login
  var loginSuccess = function(profile, token, accessToken, state, refreshToken) {
    // Success callback
    UserService.setUser(profile);
    console.log('profile:', profile);
    store.set('profile', profile);
    store.set('token', token);
    store.set('refreshToken', refreshToken);
    $state.go('app.artists.index');
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
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile device'
      }
    }, loginSuccess, loginError);
  };
});
