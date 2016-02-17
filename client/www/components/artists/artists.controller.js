angular.module('main.artists', ['main.services', 'main.artist', 'main.artistList'])

.controller('ArtistsCtrl', ArtistsCtrl);

function ArtistsCtrl($stateParams, $window, $state, Artist, User, UserService, store) {
  // initial call to populate artists list
  this.artists = Artist.query();
  // grab user information for store data
  this.user = store.get('userData');

  // variables for favorite / live toggles
  var favToggled = false;
  var liveToggled = false;

  // This object receives info from favorites directive. It needs to be an object because angular inheritance.
  this.obj = {
    favClicked: false
  };

  // click handler for favorites toggle
  this.toggleFavorite = function() {
    favToggled = !favToggled;
  };

  // click handler for live toggle
  this.toggleLive = function() {
    liveToggled = !liveToggled;
  };

  // custom filter for user favorites
  this.filterByFavorite = artist => {
    if (favToggled) {
      if (this.user.favorite_artists.indexOf(artist.fbid) === -1) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  };

  // custom filter for live artists
  this.filterByLive = function(artist) {
    if (liveToggled) {
      return artist.live;
    }
    return true;
  };

  // pull to refresh functionality
  this.refresh = () => {
    // re-populate artists list with new data
    Artist.query().$promise.then(function(allArtists) {
      // Stop the ion-refresher from spinning
      this.artists = allArtists;
      // Get user so favorites update, only if user has updated a favorite
      if (this.obj.favClicked === true) {
        UserService.getUser()
          .then(function(res) {
            this.user = res;
          });
      }
      this.$broadcast('scroll.refreshComplete');
    });
  };
}
