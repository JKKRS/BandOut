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

          var currentLocation = {
            location: [pos.coords.longitude, pos.coords.latitude],
            distance: 50
          };

          console.log("currentLocation", currentLocation);

          $http({
            url: API_URL + '/apis/artists/live',
            method: "POST",
            data: currentLocation,
            headers: {
              'Content-Type': 'application/json'
            }
          }).success(function(data, status) {
            console.log("Data?", data);
            console.log("status?", status);
            // var marker;
            // var contentString;

            for (var i = 0; i < data.length; i++) {
              var ArtistName = data[i].name;
              console.log("Name", ArtistName);
              console.log("logging", data[i].location.coordinates[1], data[i].location.coordinates[0]);
              var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(data[i].location.coordinates[1], data[i].location.coordinates[0]),
                map: map,
                labelContent: ArtistName,
                labelAnchor: new google.maps.Point(35, 0),
                labelClass: "labels"
              });

              (function(){
                var contentString = '<div id="content">' +
                  '<div id="siteNotice">' +
                  '</div>' +
                  '<h4 id="firstHeading" class="firstHeading">' + data[i].name + '</h4>' +
                  '<div id="bodyContent">' +
                  '<a href="' + data[i].artist_info.paypal_link + '">' +
                  'My PayPal</a> ' +
                  '</div>' +
                  '</div>';

                  var infowindow = new google.maps.InfoWindow({
                    content: contentString
                  });

                  marker.addListener('click', function() {
                    infowindow.open(map, marker);
                  });

              })();

            }

            // contentString = '<div id="content">' +
            //   '<div id="siteNotice">' +
            //   '</div>' +
            //   '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
            //   '<div id="bodyContent">' +
            //   '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            //   'sandstone rock formation in the southern part of the ' +
            //   'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
            //   'south west of the nearest large town, Alice Springs; 450&#160;km ' +
            //   '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
            //   'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
            //   'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
            //   'Aboriginal people of the area. It has many springs, waterholes, ' +
            //   'rock caves and ancient paintings. Uluru is listed as a World ' +
            //   'Heritage Site.</p>' +
            //   '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
            //   'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
            //   '(last visited June 22, 2009).</p>' +
            //   '</div>' +
            //   '</div>';
            //
            //
            // var infowindow = new google.maps.InfoWindow({
            //   content: contentString
            // });
            // //
            // marker.addListener('click', function() {
            //   infowindow.open(map, marker);
            // });

          });
        });
    };

    $scope.findMe = function() {
      $cordovaGeolocation.getCurrentPosition({
          timeout: 1000,
          enableHighAccuracy: false
        })
        .then(function(pos) {
          map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        });
    };

    $scope.map = map;
    $scope.center();

  });
