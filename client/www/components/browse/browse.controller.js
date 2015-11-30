angular.module('starter.mapBrowse', ['uiGmapgoogle-maps'])
  .controller('MapController', function($scope, $ionicLoading, $cordovaGeolocation, UserService) {

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

    console.log("line 28");

    var nearLoc = [
      ["30.269219", "-97.740882"],
      ["30.268450", "-97.740418"]
    ];

    UserService.getUser().then(function(res) {
      console.log("testing", res);
    });


    var test = "FireIntheBuilding";
    console.log("nearLoc", nearLoc);

    for (var i = 0; i < nearLoc.length; i++) {
      var marker = new MarkerWithLabel({
        position: new google.maps.LatLng(nearLoc[i][0], nearLoc[i][1]),
        map: map,
        labelContent: test,
        labelAnchor: new google.maps.Point(35, 0),
        labelClass: "labels"
      });
    }



    var image = "../../resources/ios/icon/icon-40.png";


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
            title: "My Location",
            icon: image
          });
        });
    };

    $scope.map = map;
    $scope.center();

  });
