angular.module('starter.mapBrowse', ['uiGmapgoogle-maps'])
  .controller('MapController', function($scope, $ionicLoading, $compile) {
      //$compile - HTML string into a tempalte and produces a template functio
      //used to link SCOPE and template together
      google.maps.event.addDomListener(window, 'load', function() {
          var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

          var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          var map = new google.maps.Map(document.getElementById("map1"), mapOptions);

          $scope.loading = $ionicLoading.show({
            content: "Finding Buskers Near You",
            showBackdrop: false
          });

          $scope.centerOnMe = function() {
            if (!$scope.map) {
              return;
            }
          }

            navigator.geolocation.getCurrentPosition(function(pos) {
              map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
              $scope.loading.hide();
              var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
              });
            });

            $scope.map = map;
          });

      });
