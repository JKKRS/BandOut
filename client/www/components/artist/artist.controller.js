angular.module('starter.artist', ['starter.services', 'ngOpenFB'])

.controller('ArtistCtrl', ArtistCtrl);

function ArtistCtrl($scope, $stateParams, Artist) {
  $scope.artist = $stateParams.artist;
}
