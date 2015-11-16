angular.module('starter.services', ['ngResource'])

.constant("FACEBOOK_APP_ID", "924056997681768")

.service('UserService', function($http) {
  // ** TEMPORARY **
  // NEEDS TO NOT STORE IN LOCAL, SHOULD USE DB
  var setUser = function(user_data) {
    // var auth = user_data.authResponse;
    // var profile = user_data.profileInfo;
    // var user = User(auth.userID, profile.name, user_data.picture, profile.email, auth)

    // $http({
    //   method : 'POST',
    //   dataType : 'json',
    //   headers : { 'Content-Type': 'application/json' },
    //   data : user,
    //   url : 'http://localhost:5000/apis/users'
    // })
    // .then(function(response) {
    //   console.log('response from server', response);
    // })

    window.localStorage.setItem('ionFB_user', JSON.stringify(user_data));
  };

  var userIsLoggedIn = function() {
    var user = getUser();
    return user.authResponse.userID !== null;
  };

  var getUser = function() {
    return JSON.parse(window.localStorage.getItem('ionFB_user') || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser,
    userIsLoggedIn: userIsLoggedIn
  };
})

.factory('Session', function($resource) {
  return $resource('http://localhost:5000/sessions/:sessionId');
})

.factory('Artist', function($resource) {
  return $resource('http://localhost:5000/artists/:artistId');
})

.factory('User', function($resource) {
  return $resource('http://localhost:5000/apis/users');
});

