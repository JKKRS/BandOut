angular.module('starter.addEvent', ['uiGmapgoogle-maps'])

.controller('addEventCtrl', addEventCtrl);

function addEventCtrl($scope, User, $stateParams, UserService) {
  $scope.user = $stateParams.user;
  $scope.location = {};
  $scope.location.lat = null;
  $scope.location.long = null;

  var geocoder = new google.maps.Geocoder();
  $scope.saveEvent = function() {
    geocoder.geocode({
      'address': $scope.user.venueAddress + ' ' + $scope.user.venueCity + ' ' + $scope.user.venueZip
    }, function(results, status) {
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
        $scope.user.date,
        $scope.user.description,
        venueAdd
      );

      UserService.getUser()
        .then(function(res) {
          console.log("Hi, Im the guy who ruined your sleep", res);
          console.log("I might help", res.artist_info.upcoming_events );
          console.log("I'm the guy that stopped it", eventAdd);
          res.artist_info.upcoming_events.push(eventAdd);
          console.log("YATA?!", res.artist_info.upcoming_events)

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
