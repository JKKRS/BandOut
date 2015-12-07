angular.module('main.artist', ['main.services'])

.controller('ArtistCtrl', ArtistCtrl);

function ArtistCtrl($scope, $stateParams, $window, $state, Artist) {
  // set artist to artist object passed from artists view
  $scope.artist = $stateParams.artist;
  // on-click handler for paypal information
  $scope.payPal = function(link) {
    link = link.toString();
      $window.open( link, '_blank', 'location=yes');
  };
  // pull to refresh function to display newly updated information
  $scope.refresh = function() {
    Artist.get({'artistId': $scope.artist.fbid})
    .$promise.then(function(data) {
      $scope.artist = data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  // click handler for individual event view. pass event information as stateParam
  $scope.eventDetail = function(event) {
    $state.go('app.artists.artist-event', {event: event, eventId: event.id});
  };
  // gesture functionality --> same as $scope.eventDetail
  $scope.onSwipeLeft =function(event) {
    $state.go('app.artists.artist-event', {event: event, eventId: event.id});
  };
}
