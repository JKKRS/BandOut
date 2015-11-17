angular.module('starter.services', ['ngResource'])

.constant("FACEBOOK_APP_ID", "924056997681768")

.service('UserService', function($http, $timeout, $q, User) {
  // ** TEMPORARY **
  // NEEDS TO NOT STORE IN LOCAL, SHOULD USE DB
  var setUser = function(user_data) {
    var auth = user_data.authResponse;
    var profile = user_data.profileInfo;
    var user_obj = NewUser(auth.userID, profile.name, user_data.picture, profile.email, auth)

    User.save(user_obj, function(res) {
      console.log('res', res);
    })
  };

  var userIsLoggedIn = function() {
    var user = getUser();
    return /*user.authResponse.userID !== null;*/ true;
  };

  var getUser = function(callback) {
    return $q(function(resolve, reject) {
      // $timeout(function() {
        if (window.FB) {
          resolve()
        }
      })
      .then(function() {
        facebookConnectPlugin.getLoginStatus(function(res) {
          console.log('FB RESPONSE:', res)
          return User.get({ "fbid" : res.authResponse.userID })
          .$promise.then(function(res) {
            return $q(function(resolve, reject) {
              console.log(res)
              resolve(res);
            });
          })
        })
      // }, 150);
    })
  };

    // return JSON.parse(window.localStorage.getItem('ionFB_user') || '{}');
  return {
    getUser: getUser,
    setUser: setUser,
    userIsLoggedIn: userIsLoggedIn
  };
})

.factory('Artist', function($resource) {
  return $resource('http://bandout.herokuapp.com/apis/artists/:artistId');
})

.factory('User', function($resource) {
  return $resource('http://localhost:5000/apis/users/:fbid', null, {
    'update' : { method : 'PUT' }
  });
})