angular.module('main.services', ['ngResource'])

// .constant("API_URL", "http://localhost:5000")
.constant("API_URL", "https://bandout.herokuapp.com")

.service('UserService', function($http, $timeout, $q, User, store) {
  var makeUser = function(profile) {
    var user = {
      "fbid": profile.user_id,
      "name": profile.name,
      "image": 'https://graph.facebook.com/' + profile.user_id + '/picture?type=large',
      "email": profile.email
    };
    return user;
  };

  var setUser = function(user_data) {
    var user_obj = makeUser(user_data);
    return $q(function(resolve, reject) {
      User.get({
        'fbid': user_obj.fbid
      }).$promise.then(function(val) {
        if (val.nouser) {
          User.save(user_obj, function(user) {
            console.log('saved', user);
            resolve(user);
          });
        }
        resolve(val);
      });
    });
  };

  var getUser = function() {
    return $q(function(resolve, reject) {
      return User.get({
          "fbid": store.get('profile').user_id
        })
        .$promise
        .then(function(res) {
          // console.log('UserService getUser', res);
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

  function NewEvent(title, datetime, description, venue) {
    var newEvent = Object.create(Object.prototype);
    newEvent = {
      "title": title,
      "datetime": datetime,
      "description": description,
      "venue": venue
    };
    return newEvent;
  }

  function NewVenue(name, address, zip, city, latit, longit) {
    var newVenue = Object.create(Object.prototype);
    newVenue = {
      "name": name,
      "address": address,
      "zip": zip,
      "city": city,
      "country": "",
      "latitude": latit,
      "longitude": longit
    };
    return newVenue;
  }

  return {
    getUser: getUser,
    setUser: setUser,
    NewEvent: NewEvent,
    NewVenue: NewVenue,
    createTimestamp: createTimestamp
  };
})

.service('DeviceService', function($http, $q, Device, store) {
  var setDevice = function(device_data) {
    // device_data: {
    //   device_id: 'asdf123', push: bool, 'location.coordinates': [long, lat]
    // }
    return $q(function(resolve, reject) {
      Device.get({
        'deviceId': device_data.device_id
      }).$promise.then(function(val) {
        if (val.noDevice) {
          Device.save(device_data, function(dev) {
            console.log('saved device', dev);
            resolve(dev);
          });
        }
        resolve(val);
      });
    });
  };

  var getDevice = function() {
    return $q(function(resolve, reject) {
      return Device.get({
          'deviceId': store.get('device_token')
        })
        .$promise
        .then(function(res) {
          resolve(res);
        });
    });
  };

  var updateDevice = function(device_data) {
    // device_data = { push: bool, 'location.coordinates': [long, lat] }
    Device.update({
      'deviceId': store.get('device_token')
    }, device_data);
  };

  return {
    setDevice: setDevice,
    getDevice: getDevice,
    updateDevice: updateDevice
  };
})

.factory('Artist', function($resource, API_URL) {
  return $resource(API_URL + '/apis/artists/:artistId');
})

.factory('User', function($resource, API_URL) {
  return $resource(API_URL + '/apis/users/:fbid', null, {
    'update': {
      method: 'PUT'
    }
  });
})

.factory('Device', function($resource, API_URL) {
  return $resource(API_URL + '/apis/devices/:deviceId', null, {
    'update': {
      method: 'PUT'
    }
  });
});
