angular.module('starter.mapBrowse', ['uiGmapgoogle-maps'])
.controller('MapController', MapController);

function MapController($scope, $timeout, $ionicLoading, $ionicPopup, $cordovaGeolocation, $cordovaInAppBrowser, $cordovaLaunchNavigator, $compile, $http, API_URL) {
  var markersArray = [];

  function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }

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

  // $scope.loading = $ionicLoading.show({
  //   template: "Finding Buskers Near You",
  //   showBackdrop: false
  // });

  var resizeMap = function() {
    google.maps.event.trigger(map, 'resize');
  };

  var navigateHere = function(endLat, endLong, startLat, startLong) {
    var end = [endLat, endLong];
    var begin = [startLat, startLong];

    $cordovaLaunchNavigator.navigate(end, begin)
      .then(function() {
        console.log("Working?");
      }, function(err) {
        console.error(err);
      });
  };

  var liveArtist = function() {
    loading();
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

        markersArray.push(myLocation);

        var currentLocation = {
          location: [pos.coords.longitude, pos.coords.latitude],
          distance: 1000
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
            generateMarker(data[i], map, pos.coords.latitude, pos.coords.longitude);
          }
        });
      }, function(err) {
        $timeout(function() {
          $ionicLoading.hide();
        }, 0)
          .then(function() {
            $ionicPopup.alert({
              title: 'Unable to Get Location',
              template: err.message
            })
              .then(function(res) {
                console.log('User Acknowledged Error');
              });
          });
      });
    google.maps.event.addListenerOnce(map, 'idle', resizeMap);
  };

  $scope.findMe = function() {
    clearOverlays();
    liveArtist();
  };

  $scope.map = map;
  liveArtist();

  // Helper Land
  function loading() {
    $ionicLoading.show({
      template: "Finding Local Artists",
      showBackdrop: true
    });
  }

  function generateMarker(item, targetMap, myLocationLat, myLocationLong) {
    var ArtistName = item.name;
    var marker = new MarkerWithLabel({
      position: new google.maps.LatLng(item.location.coordinates[1], item.location.coordinates[0]),
      map: targetMap,
      labelContent: ArtistName,
      labelAnchor: new google.maps.Point(35, 0),
      labelClass: "labels"
    });

    $scope.markerDirection = function() {
      navigateHere(item.location.coordinates[1], item.location.coordinates[0], myLocationLat, myLocationLong);
    };

    var contentString = '<ion-item id="container">' +
      '<div id="bodyContent">' +
      '<div class="title">' + item.name + '</div>' +
      '<img class= "mapImage" src="'+ item.image +'"/>'+
      '<a ng-click="markerDirection()">' +
      'Directions</a> ' +
      '</div>' +
      '<div class="iw-bottom-gradient"></div>'+
      '</ion-item>'
      console.log("Item info: ", item);
        
    var compiled = $compile(contentString)($scope);
      console.log('What is being compiled?', compiled);
    var infowindow = new google.maps.InfoWindow({
      content: compiled[0],
      maxWidth: 200
    });

    google.maps.event.addListener(infowindow, 'domready', function() {
       var iwOuter = $('.gm-style-iw');
       var iwBackground = iwOuter.prev();
       iwBackground.children(':nth-child(2)').css({'display' : 'none'});
       iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    });
    
      // marker.addListener('click', function() {
      //   infowindow.open(targetMap, marker);
      // });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });

    google.maps.event.addListener(map, 'click', function() {
      infowindow.close();
    });
  }
}
