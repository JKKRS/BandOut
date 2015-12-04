angular.module('starter.addEvent', ['uiGmapgoogle-maps'])

.controller('addEventCtrl', addEventCtrl);

function addEventCtrl($scope, User, $state, $stateParams, $cordovaDatePicker, UserService) {
  $scope.user = $stateParams.user;
  $scope.location = {};
  $scope.location.lat = null;
  $scope.location.long = null;
  $scope.locationChanged = function(val) {
    $scope.user.venueName = val.description;
    console.log('calling location changed', val);
  };

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
    console.log('saveEvent() $scope.user', $scope.user);
    geocoder.geocode({
      'address': $scope.user.venueName
    },
    function(results, status) {

      var timestamp = UserService.createTimestamp($scope.user.date, $scope.user.time);

      if (status == google.maps.GeocoderStatus.OK) {
        $scope.location.lat = results[0].geometry.location.lat();
        $scope.location.long = results[0].geometry.location.lng();
        console.log($scope.location.lat, $scope.location.long);
      } else {
        $scope.location.lat = 34.0775;
        $scope.location.long = 118.4750;
      }

      var venueAdd = UserService.NewVenue(
        $scope.user.venueName,
        $scope.user.venueAddress,
        $scope.user.venueZip,
        $scope.user.venueCity,
        $scope.location.lat,
        $scope.location.long
      );


      var eventAdd = UserService.NewEvent(
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
          $state.go('app.editProfile.yourEvents');
        });
    });

  };
}
