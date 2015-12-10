angular.module('main.eventView', ['uiGmapgoogle-maps'])

.controller('eventViewCtrl', eventViewCtrl);

function eventViewCtrl($scope, $stateParams, $cordovaGeolocation, $cordovaLaunchNavigator) {
  // set scope variables from passed in state parameter
  $scope.event = $stateParams.event;
  $scope.lat = $stateParams.event.venue.latitude;
  $scope.long = $stateParams.event.venue.longitude;
  // set map view options using scope variables
  var myLatlng = new google.maps.LatLng($scope.lat, $scope.long);
  var mapOptions = {
    streetViewControl: true,
    scrollwheel: false,
    draggable: false,
    center: myLatlng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  // create map and marker
  var map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map
  });

  var resizeMap = function() {
    google.maps.event.trigger(map, 'resize');
  };

  $scope.map = map;
  resizeMap();

  // Google location completion
  $scope.locationChanged = function(val) {
    $scope.event.venueName = val.description;
  };

  // Open directions from map
  $scope.getDirections = function(eventLatitude, eventLongitude) {
    $cordovaGeolocation.getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: false
    }).then(function(pos) {
      var currentLatitude = pos.coords.latitude;
      var currentLongitude = pos.coords.longitude;

      var from = [currentLatitude, currentLongitude];
      var to = [eventLatitude, eventLongitude];

      $cordovaLaunchNavigator.navigate(to, from)
        .then(function(res) {

        }, function(err) {
          console.error(err);
        });

    });
  };
}
