angular.module('starter.addEvent', ['uiGmapgoogle-maps'])

.controller('addEventCtrl', addEventCtrl);

function addEventCtrl($scope, User, $stateParams, $cordovaDatePicker, UserService) {
  $scope.user = $stateParams.user;
  $scope.location = {};
  $scope.location.lat = null;
  $scope.location.long = null;

  $scope.datePicker = function(e) {
    $cordovaDatePicker.show().then(function(date){
      $scope.user.date = date;
    });
  };

  var timeOptions = {
    date: new Date(),
    mode: 'time',
    allowOldDates: true,
    allowFutureDates: true,
    doneButtonLabel: 'DONE',
    doneButtonColor: '#000000',
    cancelButtonLabel: 'CANCEL',
    cancelButtonColor: '#000000'
  };

  $scope.timePicker = function(e) {
    $cordovaDatePicker.show(timeOptions).then(function(time) {
      $scope.user.time = time;
    });
  };

  var geocoder = new google.maps.Geocoder();
  $scope.saveEvent = function() {
    geocoder.geocode({
      'address': $scope.user.venueAddress + ' ' + $scope.user.venueCity + ' ' + $scope.user.venueZip
    },
    function(results, status) {

      var date = moment($scope.user.date);
      var time = moment($scope.user.time);
      var dateString = date.format('YYYY-MM-DD');
      var timeString = time.format('hh:mm:ss.SSS');

      var timestamp = dateString + 'T' + timeString + 'Z';
      timestamp = new Date(timestamp);

      if (status == google.maps.GeocoderStatus.OK) {
        $scope.location.lat = results[0].geometry.location.lat();
        $scope.location.long = results[0].geometry.location.lng();
      } else {
        $scope.location.lat = 34.0775;
        $scope.location.long = 118.4750;
      }

      var venueAdd = NewVenue(
        $scope.user.venueName,
        $scope.user.venueAddress,
        $scope.user.venueZip,
        $scope.user.venueCity,
        $scope.location.lat,
        $scope.location.long
      );

      var venueId = Math.floor(Math.random() * 832);

      var eventAdd = NewEvent(
        venueId,
        $scope.user.title,
        timestamp,
        $scope.user.description,
        venueAdd
      );

      UserService.getUser()
        .then(function(res) {
          res.artist_info.upcoming_events.push(eventAdd);
          User.update({
            "fbid": res.fbid
          },res);
        });
    });


  };
}

function NewEvent(id, title, datetime, description, venue) {
  var newEvent = Object.create(Object.prototype);
  newEvent = {
    "id": id,
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
