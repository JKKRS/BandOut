angular.module('main.artistList', ['main.services'])

.directive('artistList', function() {
  return {
    scope: {},
    bindToController: {
      artists: '=',
    },
    controller: ArtistListItemCtrl,
    controllerAs: 'listItem',
    templateUrl: '../components/artistListItem/artistList.html'
  };
});


function ArtistListItemCtrl($window, $state) {
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

}

