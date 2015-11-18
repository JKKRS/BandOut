angular.module('starter.addEvent', ['uiGmapgoogle-maps'])

.controller('addEventCtrl', addEventCtrl);

function addEventCtrl($scope, $http, User, $stateParams, UserService) {
  $scope.user = $stateParams.user;
  $scope.user.title = "";
  $scope.user.venueName = "";
  $scope.user.date = "";
  // $scope.user.time = "";
  $scope.user.venueAddress = "";
  $scope.user.venueCity = "";
  // $scope.user.venueCountry = "";
  $scope.user.venueZip = "";
  $scope.user.description = "";
  $scope.location = {}
  $scope.location.lat = null;
  $scope.location.long = null;
  // var lat = null;
  // var long = null;

  var geocoder = new google.maps.Geocoder();

  // var address = "1200 Getty Center Dr"
  $scope.saveEvent = function() {

    geocoder.geocode({
      'address': $scope.user.venueAddress + ' ' + $scope.user.venueCity + ' ' + $scope.user.venueZip
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        $scope.location.lat = results[0].geometry.location.lat();
        $scope.location.long = results[0].geometry.location.lng();
        console.log('Hello', $scope.location.lat);
      } else {
        $scope.location.lat = 34.0775;
        $scope.location.long = 118.4750;
      }
      var venueAdd = NewVenue(
        $scope.user.venueName,
        $scope.user.venueCity,
        $scope.location.lat,
        $scope.location.long
      );
      console.log("One", venueAdd);

      var venueId = Math.floor(Math.random() * 82) + 'BO';

      var eventAdd = NewEvent(
        venueId,
        $scope.user.title,
        $scope.user.date,
        $scope.user.description,
        venueAdd
      );
      console.log("two", eventAdd);

      User.update({
        "fbid": $scope.user.fbid
      }, eventAdd);

    });


  };
  console.log($scope.user.fbid)
}

function NewEvent(id, title, datetime, description, venue) {
  var newEvent = Object.create(Object.prototype);
  console.log('Check', venue);
  newEvent = {
    "id": id,
    "title": title,
    "datetime": datetime,
    "description": description,
    "venue": venue
  };
  return newEvent;
}

function NewVenue(name, city, latit, longit) {
  var newVenue = Object.create(Object.prototype);
  newVenue = {
    "name": name,
    "city": city,
    "latitude": latit,
    "longitude": longit
  };
  return newVenue;
}
