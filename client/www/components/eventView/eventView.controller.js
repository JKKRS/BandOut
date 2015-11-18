angular.module('starter.eventView', ['uiGmapgoogle-maps'])

.controller('eventViewCtrl', eventViewCtrl);

function eventViewCtrl($scope, $stateParams) {
  $scope.event = $stateParams.event;
  // temporary lat-long. will replace with Band in Town API information
  var myLatlng = new google.maps.LatLng(45 ,-73);
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
