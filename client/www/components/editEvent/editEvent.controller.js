angular.module('main.editEvent', ['uiGmapgoogle-maps'])
  .controller('editEventCtrl', editEventCtrl);

function editEventCtrl($scope, $state, User, $stateParams, UserService) {
  $scope.event = $state.params.event;
  $scope.location = {};
  $scope.location.lat = null;
  $scope.location.long = null;

  $scope.event.date = new Date($scope.event.datetime);
  $scope.event.time = new Date($scope.event.datetime);

  // console.log('date',$scope.event.date);
  // console.log('time',$scope.event.time);

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

      var timestamp = UserService.createTimestamp($scope.event.date, $scope.event.time);
      // console.log(timestamp);

      UserService.getUser()
        .then(function(res) {
          for (var i = 0; i <= res.artist_info.upcoming_events.length; i++) {
            if (res.artist_info.upcoming_events[i]._id === $scope.event._id) {
              res.artist_info.upcoming_events[i] = $scope.event;
              res.artist_info.upcoming_events[i].venue.latitude = $scope.location.lat;
              res.artist_info.upcoming_events[i].venue.longitude = $scope.location.long;
              res.artist_info.upcoming_events[i].datetime = timestamp;
              User.update({
                "fbid": res.fbid
              }, res);
              break;
            }
          }
          $state.go('app.editProfile.yourEvents');
        });

    });
  };
}
