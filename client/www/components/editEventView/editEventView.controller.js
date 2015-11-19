angular.module('starter.editEventView', ['uiGmapgoogle-maps'])
  .controller('editEventViewCtrl', editEventViewCtrl);

function editEventViewCtrl($scope, $state, User, $stateParams, UserService) {
  $scope.event = $state.params.event;
  $scope.location = {};
  $scope.location.lat = null;
  $scope.location.long = null;

  var geocoder = new google.maps.Geocoder();
  $scope.updateEvent = function() {
    geocoder.geocode({
      'address': $scope.event.venue.address + ' ' + $scope.event.venue.city + ' ' + $scope.event.venue.zip
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        $scope.location.lat = results[0].geometry.location.lat();
        $scope.location.long = results[0].geometry.location.lng();
      } else {
        $scope.location.lat = 34.0775;
        $scope.location.long = 118.4750;
      }
      var venueAdd = NewVenue(
        $scope.event.venue.name,
        $scope.event.venue.address,
        $scope.event.venue.zip,
        $scope.event.venue.city,
        $scope.location.lat,
        $scope.location.long
      );

      var eventAdd = NewEvent(
        $scope.event.title,
        $scope.event.datetime,
        $scope.event.description,
        venueAdd
      );

      UserService.getUser()
        .then(function(res){
          var updatedShow = res.artist_info.upcoming_events;
          for(var i= 0; i< updatedShow.lenght; i++){
            if(updatedShow[i].id === $scope.event.id){
              updatedShow[i] = eventAdd;
            } else {
              return updatedShow;
            }
          }

          var userObj = {
            artist_info: {
              paypal_link: res.artist_info.paypal_link,
              upcoming_events: []
            }
          };

          userObj.artist_info.upcoming_events = updatedShow;
          User.update({
            "fbid":res.fbid
          }, userObj);

        });

    });
  };
}

function NewEvent( title, datetime, description, venue) {
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
