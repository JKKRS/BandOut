angular.module('main.artists', ['main.services', 'main.artist', 'main.artistList'])

.controller('ArtistsCtrl', ArtistsCtrl);

function ArtistsCtrl($scope, $stateParams, $window, $state, Artist, User, UserService, store) {
  // initial call to populate artists list
  $scope.artists = Artist.query();
  // grab user information for store data
  $scope.user = store.get('userData');

  // variables for favorite / live toggles
  var favToggled = false;
  var liveToggled = false;

  // This object receives info from favorites directive. It needs to be an object because angular inheritance.
  $scope.obj = {
    favClicked: false
  };

  // click handler for favorites toggle
  $scope.toggleFavorite = function() {
    favToggled = !favToggled;
  };

  // click handler for live toggle
  $scope.toggleLive = function() {
    liveToggled = !liveToggled;
  };

  // custom filter for user favorites
  $scope.filterByFavorite = function(artist) {
    if (favToggled) {
      if ($scope.user.favorite_artists.indexOf(artist.fbid) === -1) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  };

  // custom filter for live artists
  $scope.filterByLive = function(artist) {
    if (liveToggled) {
      return artist.live;
    }
    return true;
  };

  // pull to refresh functionality
  $scope.refresh = function() {
    // re-populate artists list with new data
    Artist.query().$promise.then(function(allArtists) {
      // Stop the ion-refresher from spinning
      $scope.artists = allArtists;
      // Get user so favorites update, only if user has updated a favorite
      if ($scope.obj.favClicked === true) {
        UserService.getUser()
          .then(function(res) {
            $scope.user = res;
          });
      }
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
}
