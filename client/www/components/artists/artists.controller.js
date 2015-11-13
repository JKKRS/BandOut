angular.module('starter.artists', ['starter.services', 'ngOpenFB'])

.controller('ArtistsCtrl', function($scope, Artist) {
  $scope.artists = Artist.query();
});
