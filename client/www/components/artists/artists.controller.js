angular.module('starter.artists', ['starter.services'])

.controller('ArtistsCtrl', ArtistsCtrl);

function ArtistsCtrl($scope, $state, Artist) {
  $scope.artists = Artist.query();
  $scope.refresh = function() {
    Artist.query().$promise.then(function(allArtists) {
       // Stop the ion-refresher from spinning
       $scope.artists = allArtists;
       $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.artistDetail = function(artist) {
    $state.go('app.artists.artist', {
      artist: artist,
      artistId: artist.fbid
    });
  };
}
