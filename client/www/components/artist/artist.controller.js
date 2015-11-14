angular.module('starter.artist', ['starter.services', 'ngOpenFB'])

.controller('ArtistCtrl', function($scope, $stateParams, Session) {
  $scope.session = Artist.get({fbid : $stateParams.artistId});
});
