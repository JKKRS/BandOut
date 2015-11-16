angular.module('starter.artist', ['starter.services'])

.controller('ArtistCtrl', ArtistCtrl);

function ArtistCtrl($scope, $stateParams, $window, $state, Artist) {
  $scope.artist = $stateParams.artist;
  $scope.payPal = function(link) {
    link = link.toString();
      $window.open( link, '_system', 'location=yes');
  };
  $scope.eventDetail = function(event) {
    console.log(event);
    $state.go('app.artists.artist-event', {event: event, eventId: event.id});
  };
}
