angular.module('starter.eventView', ['uiGmapgoogle-maps'])

.controller('eventViewCtrl', eventViewCtrl);

function eventViewCtrl($scope, $stateParams) {
  $scope.event = $stateParams.event;
  $scope.lat = $stateParams.event.venue.latitude;
  $scope.long = $stateParams.event.venue.longitude;
  var myLatlng = new google.maps.LatLng($scope.lat, $scope.long);
    var mapOptions = {
        streetViewControl: true,
        scrollwheel: false,
        draggable: false,
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
    });
    $scope.map = map;
}
