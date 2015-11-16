angular.module('starter.artists', ['starter.services'])

.controller('ArtistsCtrl', ArtistsCtrl);

function ArtistsCtrl($scope, $state, Artist) {
  $scope.artists = Artist.query();
  $scope.artistDetail = function(artist) {
    $state.go('app.artists.artist', {
      artist: artist
    });
  };
}
