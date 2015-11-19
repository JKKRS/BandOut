angular.module('starter.addEvent', ['uiGmapgoogle-maps'])

.controller('addEventCtrl', addEventCtrl);

function addEventCtrl($scope, User, $stateParams, UserService) {
  $scope.user = $stateParams.user;
  $scope.user.title = "";
  $scope.user.venueName = "";
  $scope.user.date = null;
  // $scope.user.time = "";
  $scope.user.venueAddress = "";
  $scope.user.venueCity = "";
  // $scope.user.venueCountry = "";
  $scope.user.venueZip = "";
  $scope.user.description = "";
  $scope.location = {};
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
      var venueId = Math.floor(Math.random() * 832);

      var eventAdd = NewEvent(
        venueId,
        $scope.user.title,
        $scope.user.date,
        $scope.user.description,
        venueAdd
      );

      console.log("fire: ", eventAdd);
      console.log("FBID", $scope.user.fbid);



      UserService.getUser()
        .then(function(res) {
          var updatedShow = res.artist_info.upcoming_events
          updatedShow.push(eventAdd);
          var userObj = {
            artist_info : {
              upcoming_events : []
            }
          }
          userObj.artist_info.upcoming_events = updatedShow
          console.log(userObj, "------------");
          User.update({
            "fbid": $scope.user.fbid
          }, userObj);
        });




      // obj.artist_info.upcoming_events.push(eventAdd);



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

function NewVenue(name, city, latit, longit) {
  var newVenue = Object.create(Object.prototype);
  newVenue = {
    "name": name,
    "city": city,
    "country": "KangSnakeGame",
    "latitude": latit,
    "longitude": longit
  };
  return newVenue;
}
