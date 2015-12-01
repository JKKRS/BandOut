angular.module('starter.mapBrowse', ['uiGmapgoogle-maps'])
  // .constant("API_URL", "http://localhost:5000")
  // .constant("API_URL", "https://bandout.herokuapp.com")
  .controller('MapController', function($scope, $ionicLoading, $cordovaGeolocation, $http) {

    var Latlng = new google.maps.LatLng(34.045148, -118.564925);

    var mapOptions = {
      center: Latlng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var styleMaps = [{
      featureType: "poi",
      elementType: "all",
      stylers: [{
        visibility: "off"
      }]
    }];

    var map = new google.maps.Map(document.getElementById("map1"), mapOptions);

    var styledMapOptions = {
      map: map,
      name: "noPoi"
    };

    var styledMap = new google.maps.StyledMapType(styleMaps, styledMapOptions);
    map.mapTypes.set("noPoi", styledMap);
    map.setMapTypeId("noPoi");

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
          map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $ionicLoading.hide();
          var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map,
            title: "My Location"
          });

          var check = {
            location: [pos.coords.longitude, pos.coords.latitude],
            distance: 50
          };

          $http({
            url: 'http://localhost:5000/apis/artists/live',
            method: "POST",
            data: check,
            headers: {
              'Content-Type': 'application/json'
            }
          }).success(function(data, status) {
            console.log("Data?", data);
            console.log("status?", status);

            var test = "FireIntheBuilding";

            for (var i = 0; i < data.length; i++) {
              var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(data[i][0], data[i][1]),
                map: map,
                labelContent: test,
                labelAnchor: new google.maps.Point(35, 0),
                labelClass: "labels"
              });
            }

          });


        });
    };

    $scope.findMe = function() {
      $cordovaGeolocation.getCurrentPosition({
          timeout: 10000,
          enableHighAccuracy: false
        })
        .then(function(pos) {
          map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        });
    };

    $scope.map = map;
    $scope.center();

  });
