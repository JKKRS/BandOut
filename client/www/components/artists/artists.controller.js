angular.module('starter.artists', ['starter.services', 'starter.artist'])

.controller('ArtistsCtrl', ArtistsCtrl);

function ArtistsCtrl($scope, $filter, $stateParams, $window, $state, Artist, User, store) {

  $scope.artists = Artist.query();

  var user = store.get('userData');

  var favToggled = false;
  var liveToggled = false;

  $scope.toggleFavorite = function() {
    favToggled = !favToggled;
  };

  $scope.toggleLive = function() {
    liveToggled = !liveToggled;
  }

  $scope.filterByFavorite = function(artist) {
    if (favToggled) {
      if (user.favorite_artists.indexOf(artist.fbid) === -1) {
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
  }

  // Conditionally set class for heart icon
  $scope.getClass = function(artist) {
    return {
      'ion-ios-heart' : user.favorite_artists.indexOf(artist.fbid) > -1,
      'ion-ios-heart-outline' : user.favorite_artists.indexOf(artist.fbid) === -1
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
      console.log('to save', currentUser);
      User.update({ 'fbid' : userID }, currentUser);
    });
  };
}
