angular.module('starter.services', ['ngResource'])

.constant("FACEBOOK_APP_ID", "924056997681768")

.service('UserService', function($http, $timeout, $q, User, store) {
  var newUser = function(profile) {
    var userId = profile.user_id.substr(9);
    var user = {
      "fbid" : userId,
      "name" : profile.name,
      "image" : 'https://graph.facebook.com/' + userId + '/picture?type=large',
      "email" : profile.email,
      "artist" : false
    };
    console.log('newUser:', user);
    return user;
  };

  var setUser = function(user_data) {
    var user_obj = newUser(user_data);
    console.log('getting?');
    User.get({'fbid': user_obj.fbid}).$promise.then(function(val) {console.log('hi', val);});
    User.save(user_obj, function(res) {
      console.log('res', res);
    });
  };

  var getUser = function() {
    console.log(store.get('profile'));
    return $q(function(resolve, reject) {
      return User.get({ "fbid" : store.get('profile').user_id.substr(9) })
        .$promise
        .then(function(res) {
          // console.log('get user', res);
          resolve(res);
        });
    });
  };

  // Create a single timestamp from two full date objects
  var createTimestamp = function(date, time) {
    date = moment(date);
    time = moment(time);
    var dateString = date.format('YYYY-MM-DD');
    var timeString = time.format('hh:mm:ss.SSS');

    var timestamp = dateString + 'T' + timeString + 'Z';
    return new Date(timestamp);
  };

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
