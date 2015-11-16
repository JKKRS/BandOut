angular.module('starter.artist', ['starter.services'])

.controller('ArtistCtrl', ArtistCtrl);

function ArtistCtrl($scope, $stateParams, $window, Artist) {
  $scope.artist = $stateParams.artist;
  $scope.payPal = function(link) {
    link = link.toString();
      $window.open( link, '_system', 'location=yes');
  };
}
