angular.module("main.nearbyArtists", ["uiGmapgoogle-maps"])
.controller("nearbyArtistsController", NearbyArtistsController)
.config(function($stateProvider) {
  $stateProvider
  .state('app.nearbyArtists', {
    url: '/nearbyArtists',
    cache:false,
    views: {
      'nearbyArtists': {
        templateUrl: 'components/nearbyArtists/nearbyArtists.html'
      }
    },
    controller:'MapCtrl',
    data: {
      requiresLogin: true
    }
  })
});

function NearbyArtistsController($scope, $stateParams, $window, $timeout, $ionicLoading, $ionicPopup, $cordovaGeolocation, $cordovaInAppBrowser, $cordovaLaunchNavigator, $compile, $http, API_URL, store, DeviceService) {
  var markersArray = [];
  $scope.currentWindow = null;

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
    google.maps.event.trigger(map, "resize");
  };

  var navigateHere = function(endLat, endLong, startLat, startLong) {
    var end = [endLat, endLong];
    var begin = [startLat, startLong];

    $cordovaLaunchNavigator.navigate(end, begin)
     .catch(err => console.error(err));
  };

  var liveArtist = function() {
    loading();
    $cordovaGeolocation.getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: false
    })
      .then(function(pos) {
        var device_info = {
          "location.coordinates": [pos.coords.longitude, pos.coords.latitude]
        };
        DeviceService.updateDevice(device_info);
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $ionicLoading.hide();

        var myLocation = new google.maps.Marker({
          position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
          map: map,
          icon:"https://goo.gl/CmeqRi",
          title: "My Location"
        });

        markersArray.push(myLocation);

        var currentLocation = {
          location: [pos.coords.longitude, pos.coords.latitude],
          distance: 1000
        };

        $http({
          url: API_URL + "/apis/artists/live",
          method: "POST",
          data: currentLocation,
          headers: {
          "Content-Type": "application/json"
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
              title: "Unable to Get Location",
              template: err.message
            })
              .then(function(res) {
                console.log("User Acknowledged Error");
              });
          });
      });
    google.maps.event.addListenerOnce(map, "idle", resizeMap);
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
    $scope.item = item;
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

    var contentString = `<ion-item id="container">
      <div class="iw-title">${item.name}</div>
      <div class= "mapImage"><img class= "mapImage" src="${item.image}"/></div>
      <i class="icon positive ion-ios-navigate-outline iw-icon" ng-click="markerDirection()"></i>
      </ion-item>`;

      console.log("Item: ", item);
      $scope.item = item;
      console.log("Item info: ", item.artist_info.paypal_link);

    var compiled = $compile(contentString)($scope);
    var infowindow = new google.maps.InfoWindow({
      content: compiled[0],
      maxWidth: 200
    });

    google.maps.event.addListener(infowindow, "domready", function() {
      var iwOuter = $(".gm-style-iw");
      var iwBackground = iwOuter.prev();
      // Moves the InfoWindow + or - from current location
      iwOuter.parent().parent().css({left: "0px"});
      iwBackground.children(":nth-child(2)").css({"display" : "none"});
      iwBackground.children(":nth-child(4)").css({"display" : "none"});

      // Moves the shadow of the arrow 76px to the left margin
      iwBackground.children(":nth-child(1)").attr("style", function(i,s){ return s + "right: 90px !important;";});
      // Moves the arrow 76px to the left margin
      iwBackground.children(":nth-child(3)").attr("style", function(i,s){ return s + "right: 90px !important;";});

      iwBackground.children(":nth-child(3)").find("div").children().css({"background-color" : "#3a3a3a", "z-index" : "1"});
      var iwCloseBtn = iwOuter.next();
      // Apply the desired effect to the close button
      iwCloseBtn.css({"display" : "none"});
    });
      // marker.addListener("click", function() {
      //   infowindow.open(targetMap, marker);
      // });

    google.maps.event.addListener(marker, "click", function() {
      if ($scope.currentWindow !== null) { $scope.currentWindow.close(); }
      infowindow.open(map, marker);
      $scope.currentWindow = infowindow;
    });

    google.maps.event.addListener(map, "click", function() {
      infowindow.close();
    });

  }
}
