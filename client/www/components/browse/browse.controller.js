angular.module('starter.mapBrowse', ['uiGmapgoogle-maps'])
  .controller('MapController', function($scope, $ionicLoading, $cordovaGeolocation, $http, API_URL) {

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

    var resizeMap = function () {
      google.maps.event.trigger(map, 'resize');
    };

    var userMarker = function(){
      $cordovaGeolocation.getCurrentPosition({
          timeout: 10000,
          enableHighAccuracy: false
        })
        .then(function(pos) {
          var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map,
            title: "My Location"
          });
    })
  }

    var liveArtist = function() {
      $cordovaGeolocation.getCurrentPosition({
          timeout: 10000,
          enableHighAccuracy: false
        })
        .then(function(pos) {
          map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $ionicLoading.hide();

          var currentLocation = {
            location: [pos.coords.longitude, pos.coords.latitude],
            distance: 50
          };

          $http({
            url: API_URL + '/apis/artists/live',
            method: "POST",
            data: currentLocation,
            headers: {
              'Content-Type': 'application/json'
            }
          }).success(function(data, status) {

            for (var i = 0; i < data.length; i++) {
              var ArtistName = data[i].name;
              var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(data[i].location.coordinates[1], data[i].location.coordinates[0]),
                map: map,
                labelContent: ArtistName,
                labelAnchor: new google.maps.Point(35, 0),
                labelClass: "labels"
              });

              (function() {
                var contentString = '<div id="content">' +
                  '<div id="siteNotice">' +
                  '</div>' +
                  '<h4 id="firstHeading" class="firstHeading">' + data[i].name + '</h4>' +
                  '<div id="bodyContent">' +
                  // '<a href="' + data[i].artist_info.paypal_link + '">' +
                  // 'My PayPal</a> ' +
                  // '</div>' +
                  '</div>';

                var infowindow = new google.maps.InfoWindow({
                  content: contentString
                });

                marker.addListener('click', function() {
                  infowindow.open(map, marker);
                });

              })();
            }
          });
        });
      google.maps.event.addListenerOnce(map, 'idle', resizeMap);
    };

    $scope.findMe = function() {
      $cordovaGeolocation.getCurrentPosition({
          timeout: 1000,
          enableHighAccuracy: false
        })
        .then(function(pos) {
          map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          liveArtist();
        });
    };

    $scope.map = map;
    liveArtist();
    userMarker();
  });
