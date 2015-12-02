angular.module('starter.artists', ['starter.services', 'starter.artist'])

.controller('ArtistsCtrl', ArtistsCtrl);

function ArtistsCtrl($scope, $stateParams, $window, $state, Artist, User, store) {
  $scope.artists = Artist.query();

  $scope.payPal = function(link) {
    link = link.toString();
    $window.open( link, '_blank', 'location=yes');
  };

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

  $scope.onSwipeLeft = function(artist) {
    $state.go('app.artists.artist', {
      artist: artist,
      artistId: artist.fbid
    });
  };

  $scope.favorite = function(artist) {
    var userID = store.get('profile').user_id;
    User.get( { 'fbid' : userID }, function(currentUser) {
      var favs = currentUser.favorite_artists;
      if (!_.contains(favs, artist.fbid)) {
        favs.push(artist.fbid);
      } else {
        favs = favs.filter(function(id) {
          return id !== artist.fbid;
        });
      }
      User.update({ 'fbid' : userID }, currentUser);
    });
  };
}
