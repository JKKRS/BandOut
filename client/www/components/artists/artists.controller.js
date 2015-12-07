angular.module('main.artists', ['main.services', 'main.artist'])

.controller('ArtistsCtrl', ArtistsCtrl);

function ArtistsCtrl($scope, $stateParams, $window, $state, Artist, User, UserService, store) {

  $scope.artists = Artist.query();

  $scope.user = store.get('userData');

  var favToggled = false;
  var liveToggled = false;

  // This object receives info from favorites directive. It needs to be an object because angular inheritance.
  $scope.obj = { favClicked : false };

  $scope.toggleFavorite = function() {
    favToggled = !favToggled;
  };

  $scope.toggleLive = function() {
    liveToggled = !liveToggled;
  };

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

  $scope.filterByLive = function(artist) {
    if (liveToggled) {
      return artist.live;
    }
    return true;
  };

  // Conditionally set class for heart icon
  $scope.getClass = function(artist) {
    return {
      'ion-ios-heart' : $scope.user.favorite_artists.indexOf(artist.fbid) > -1,
      'ion-ios-heart-outline' : $scope.user.favorite_artists.indexOf(artist.fbid) === -1
    };
  };

  $scope.payPal = function(link) {
    link = link.toString();
    $window.open( link, '_blank', 'location=yes');
  };

  $scope.refresh = function() {
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
  $scope.artistDetail = function(artist) {
    $state.go('app.artists.artist', {
      artist: artist,
      artistId: artist.fbid
    });
  };

  // $scope.onSwipeLeft = function(artist) {
  //   $state.go('app.artists.artist', {
  //     artist: artist,
  //     artistId: artist.fbid
  //   });
  // };

  // Handle favoriting / unfavoriting artists
  $scope.favorite = function(artist) {
    var userID = store.get('profile').user_id;
    User.get( { 'fbid' : userID }, function(currentUser) {
      var favs = currentUser.favorite_artists || [];
      if (!_.contains(favs, artist.fbid)) {
        favs.push(artist.fbid);
      } else {
        favs = favs.filter(function(id) {
          return id !== artist.fbid;
        });
      }
      currentUser.favorite_artists = favs;
      User.update({ 'fbid' : userID }, currentUser);
    });
  };
}
