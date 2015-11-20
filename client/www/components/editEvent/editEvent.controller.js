angular.module('starter.editEvent', ['uiGmapgoogle-maps'])
  .controller('editEventCtrl', editEventCtrl);

function editEventCtrl($scope, $state, User, $stateParams, UserService) {
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

      UserService.getUser()
        .then(function(res) {
          for (var i = 0; i <= res.artist_info.upcoming_events.length; i++) {
            if (res.artist_info.upcoming_events[i]._id === $scope.event._id) {
              res.artist_info.upcoming_events[i] = $scope.event;
              res.artist_info.upcoming_events[i].venue.latitude = $scope.location.lat;
              res.artist_info.upcoming_events[i].venue.longitude = $scope.location.long;
              User.update({
                "fbid": res.fbid
              }, res);
              break;
            }
          }
        });

    });
  };
}