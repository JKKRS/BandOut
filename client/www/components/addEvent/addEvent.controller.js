angular.module('main.addEvent', ['uiGmapgoogle-maps'])

.controller('addEventCtrl', addEventCtrl);

function addEventCtrl($scope, User, $state, $stateParams, $cordovaDatePicker, UserService) {
  //Create $scope variables to build new user object to send back to our database
  $scope.user = $stateParams.user;
  $scope.location = {};
  $scope.location.lat = null;
  $scope.location.long = null;

  //Google location completion
  $scope.locationChanged = function(val) {
    $scope.user.venueName = val.description;
  };

  //User input is address, need to translate to Latitude and Longitude
  var geocoder = new google.maps.Geocoder();
  $scope.saveEvent = function() {
    geocoder.geocode({
        'address': $scope.user.venueName
      },
      function(results, status) {

        var timestamp = UserService.createTimestamp($scope.user.date, $scope.user.time);

        //Establish Latitude and Longitude with scope variable
        if (status == google.maps.GeocoderStatus.OK) {
          $scope.location.lat = results[0].geometry.location.lat();
          $scope.location.long = results[0].geometry.location.lng();
          console.log($scope.location.lat, $scope.location.long);
        } else {
          $scope.location.lat = 34.0775;
          $scope.location.long = 118.4750;
        }

        //Build Venue object
        var venueAdd = UserService.NewVenue(
          $scope.user.venueName,
          $scope.user.venueAddress,
          $scope.user.venueZip,
          $scope.user.venueCity,
          $scope.location.lat,
          $scope.location.long
        );

        //Build event object
        var eventAdd = UserService.NewEvent(
          $scope.user.title,
          timestamp,
          $scope.user.description,
          venueAdd
        );

        //Query call to database to push new events
        UserService.getUser()
          .then(function(res) {
            res.artist_info.upcoming_events.push(eventAdd);
            User.update({
              "fbid": res.fbid
            }, res);
            $state.go('app.editProfile.yourEvents');
          });
      });

  };
}
