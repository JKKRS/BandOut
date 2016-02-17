angular.module('main.artistList', ['main.services'])

.directive('artistList', function() {
  return {
    scope: {},
    bindToController: {
      artists: '=',
      obj: '='
    },
    controller: ArtistListItemCtrl,
    controllerAs: 'listItem',
    templateUrl: '../components/artistList/artistList.html'
  };
});


function ArtistListItemCtrl($window, $state, store) {
  this.user = store.get('userData');

  this.payPal = function(link) {
    link = link.toString();
    $window.open(link, '_blank', 'location=yes');
  };

  this.artistDetail = function(artist) {
    console.log('artist detail fired');
    $state.go('app.artists.artist', {
      artist: artist,
      artistId: artist.fbid
    });
  };

  this.getClass = artist => {
    return {
      'ion-ios-heart': this.user.favorite_artists.indexOf(artist.fbid) > -1,
      'ion-ios-heart-outline': this.user.favorite_artists.indexOf(artist.fbid) === -1
    };
  };

  this.favorite = function(artist) {
    console.log('favorite fired');
    var userID = store.get('profile').user_id;
    User.get({
      'fbid': userID
    }, function(currentUser) {
      var favs = currentUser.favorite_artists || [];
      if (!_.contains(favs, artist.fbid)) {
        favs.push(artist.fbid);
      } else {
        favs = favs.filter(function(id) {
          return id !== artist.fbid;
        });
      }
      currentUser.favorite_artists = favs;
      User.update({
        'fbid': userID
      }, currentUser);
    });
  };



  // function(artist) {
  //   console.log('get class fired');
  //   return {
  //     'ion-ios-heart': $scope.user.favorite_artists.indexOf(artist.fbid) > -1,
  //     'ion-ios-heart-outline': $scope.user.favorite_artists.indexOf(artist.fbid) === -1
  //   };
  // };

}

