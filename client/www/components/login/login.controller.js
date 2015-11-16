angular.module('starter.fbLogin', ['starter.services'])

.controller('LoginCtrl', function($scope, $state, $q, $location, UserService, $ionicLoading, FACEBOOK_APP_ID) {
  // Success callback for login
  var fbLoginSuccess = function(response) {
    if (!response.authResponse) {
      fbLoginError('Can\'t find the auth response');
      return;
    }
    console.log('Facebook Login Success');

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
      .then(function(profileInfo) {
        console.log('profile info success', profileInfo);
        // *** TEMPORARY SHOULD STORE IN DATABASE NOT LOCAL STORAGE ***
        UserService.setUser({
          authResponse: authResponse,
          profileInfo: profileInfo,
          picture: 'http://graph.facebook.com/' + authResponse.userID + '/picture?type=large'
        });

        $ionicLoading.hide();
        $location.path('app/artists');
        // $state.go('app.artists');
      }, function(fail) {
        // err handle here
        console.log('profile info err', fail);
      });
  };

  // Failure callback for login
  var fbLoginError = function(error) {
    console.log('Facebook Login Error', error);
    $ionicLoading.hide();
  };

  // Fetches Profile info from Facebook API
  var getFacebookProfileInfo = function(authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api(
      '/me?fields=email,name&access_token=' + authResponse.accessToken,
      null,
      function(response) {
        info.resolve(response);
      },
      function(response) {
        info.reject(response);
      }
    );
    return info.promise;
  };

  // Method to execute on Login button click
  $scope.login = function() {
    if (!window.cordova) {
      // we are in browser
      facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
    }

    facebookConnectPlugin.getLoginStatus(function(success) {
      if (success.status === 'connected') {
        // user logged in and is authenticated, response.authResponse has:
        // user's id, access token, signed request and time they expire
        console.log('getLoginStatus', success.status);

        $location.path('app/artists');
        // $state.go('app.artists');
      } else {
        console.log('ELSE: getLoginStatus', success.status);
        $ionicLoading.show({
          template: 'Logging in...'
        });

        // this sets up permissions requested
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
});
