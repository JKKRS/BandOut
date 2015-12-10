angular.module('ion-place-tools', [])
.directive('ionGooglePlace', [
  '$ionicTemplateLoader',
  '$ionicPlatform',
  '$q',
  '$timeout',
  '$rootScope',
  '$document',
  function($ionicTemplateLoader, $ionicPlatform, $q, $timeout, $rootScope, $document) {
    return {
      require: '?ngModel',
      restrict: 'E',
      template:
        '<div class="item ion-place-tools-autocomplete">' +
          '<input class="nanner" type="text" autocomplete="off" ng-model="searchQuery">' +
          '<div class="ion-place-tools-autocomplete-dropdown" ng-if="dropDownActive">' +
            '<ion-list>' +
              '<ion-item ng-repeat="location in locations" ng-click="selectLocation(location)">' +
                '{{location.description}}' +
              '</ion-item>' +
            '</ion-list>' +
          '</div>' +
        '</div>',
      replace: true,
      scope: {
        searchQuery: '=ngModel',
        locationChanged: '&'
      },
      link: function(scope, element, attrs, ngModel) {
        scope.dropDownActive = false;
        var service = new google.maps.places.AutocompleteService();
        var searchEventTimeout;
        var latLng = null;

        navigator.geolocation.getCurrentPosition(function (position) {
          latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        });

        var searchInputElement = angular.element(element.find('input'));

        scope.selectLocation = function(location) {
          scope.dropDownActive = false;
          scope.searchQuery = location.description;
          if (scope.locationChanged) {
            scope.locationChanged()(location);
          }
        };

        // console.log(attrs.locationChanged);

        scope.$watch('searchQuery', function(query){
          // console.log('watch fired Query:', query);
          // console.log('dropDownActive:', scope.dropDownActive);
          if (searchEventTimeout) { $timeout.cancel(searchEventTimeout); }
          searchEventTimeout = $timeout(function() {
            if (!query) { console.log('no query...returning'); return; }
            if (query.length < 3) {
              scope.locations = [];
              scope.$digest();
              return;
            }

            var req = {};
            req.input = query;
            if (latLng) {
              req.location = latLng;
              req.radius = 1500000;
            }
            service.getQueryPredictions(req, function (predictions, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                scope.locations = predictions;
                scope.$digest();
              }
            });
          }, 350); // we're throttling the input by 350ms to be nice to google's API
        });

        var onClick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          scope.dropDownActive = true;
          scope.$digest();
          searchInputElement[0].focus();
          setTimeout(function(){
            searchInputElement[0].focus();
          },0);
        };

        var onCancel = function(e){
          scope.dropDownActive = false;
          scope.$digest();
        };

        element.find('input').bind('click', onClick);
        // element.find('input').bind('blur', onCancel);
        element.find('input').bind('touchend', onClick);

        if(attrs.placeholder){
          element.find('input').attr('placeholder', attrs.placeholder);
        }
      }
    };
  }
]);
