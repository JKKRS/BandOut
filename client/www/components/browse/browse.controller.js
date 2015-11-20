angular.module('starter.mapBrowse', ['uiGmapgoogle-maps'])
  .controller('MapController', function($scope, $ionicLoading, $cordovaGeolocation) {
    var Latlng = new google.maps.LatLng(34.045148, -118.564925);
    var mapOptions = {
      center: Latlng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // $scope.center = function() {
    //   $cordovaGelocationnavigator.getCurrentPosition(function(pos) {
    //     map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    //   });
    // };

    var map = new google.maps.Map(document.getElementById("map1"), mapOptions);

    $scope.loading = $ionicLoading.show({
      template: "Finding Buskers Near You",
      showBackdrop: false
    });

    $scope.center = function() {
      $cordovaGeolocation.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: false
      })
        .then(function(pos) {
          console.log('cordova geolocation');
          map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $ionicLoading.hide();
          var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map,
            title: "My Location"
          });
        });
    };

    $scope.map = map;
    $scope.center();

  });
