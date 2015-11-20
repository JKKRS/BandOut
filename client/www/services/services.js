angular.module('starter.services', ['ngResource'])

.constant("FACEBOOK_APP_ID", "924056997681768")

.service('UserService', function($http, $timeout, $q, User) {
  // ** TEMPORARY **
  // NEEDS TO NOT STORE IN LOCAL, SHOULD USE DB
  var setUser = function(user_data) {
    var auth = user_data.authResponse;
    var profile = user_data.profileInfo;
    var user_obj = NewUser(auth.userID, profile.name, user_data.picture, profile.email, auth);

    User.save(user_obj, function(res) {
      console.log('res', res);
    });
  };

  // var userIsLoggedIn = function() {
  //   // var user = getUser();

  //   return /*user.authResponse.userID !== null;*/ true;
  // };

  var getUser = function() {
      return $q(function(resolve, reject) {
        facebookConnectPlugin.getLoginStatus(function(res) {
          return User.get({ "fbid" : res.authResponse.userID })
          .$promise
          .then(function(res) {
            // console.log('get user', res);
            resolve(res);
          });
        });
      });
  };

  // Create a single timestamp from two full date objects
  var createTimestamp = function(date, time) {
    var date = moment(date);
    var time = moment(time);
    var dateString = date.format('YYYY-MM-DD');
    var timeString = time.format('hh:mm:ss.SSS');

    var timestamp = dateString + 'T' + timeString + 'Z';
    return new Date(timestamp);
  }

    // return JSON.parse(window.localStorage.getItem('ionFB_user') || '{}');
  return {
    getUser: getUser,
    setUser: setUser,
    createTimestamp : createTimestamp
    // userIsLoggedIn: userIsLoggedIn
  };
})

.factory('Artist', function($resource) {
  return $resource('https://bandout.herokuapp.com/apis/artists/:artistId');
})

.factory('User', function($resource) {
  return $resource('https://bandout.herokuapp.com/apis/users/:fbid', null, {
    'update' : { method : 'PUT' }
  });
});
