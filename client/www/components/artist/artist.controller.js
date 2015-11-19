angular.module('starter.artist', ['starter.services'])

.controller('ArtistCtrl', ArtistCtrl);

function ArtistCtrl($scope, $stateParams, $window, $state, Artist) {
  $scope.artist = $stateParams.artist;
  $scope.payPal = function(link) {
    link = link.toString();
      $window.open( link, '_blank', 'location=yes');
  };
  $scope.refresh = function() {
    Artist.get({'artistId': $scope.artist.fbid})
    .$promise.then(function(data) {
      $scope.artist = data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.eventDetail = function(event) {
    $state.go('app.artists.artist-event', {event: event, eventId: event.id});
  };

  $scope.onSwipeLeft =function(event) {
    $state.go('app.artists.artist-event', {event: event, eventId: event.id});
  };
}
