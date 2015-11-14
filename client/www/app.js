// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', [
  'ionic',
  'starter.controllers',
  'starter.artist',
  'starter.artists',
  'starter.session',
  'starter.sessions',
  'starter.editProfile',
  'starter.addEvent',
  'ngOpenFB'
])


.run(function($ionicPlatform, ngFB) {
  ngFB.init({ appId: '924056997681768' });
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'components/menu/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'components/search/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'browse': {
          templateUrl: 'components/browse/browse.html'
        }
      }
  })

  .state('app.artists', {
    url: '/artists',
    abstract: true,
    views: {
      'artists': {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  })

  .state('app.artists.index', {
    url: '',
    templateUrl: 'components/artists/artists.html',
    controller: 'ArtistsCtrl'
  })

  .state('app.artists.artist', {
    url: '/:artistId',
    params: {artist: null},
    templateUrl: 'components/artist/artist.html',
    controller: 'ArtistCtrl'
  })

  .state('app.sessions', {
    url: '/sessions',
    views: {
      'home': {
        templateUrl: 'components/sessions/sessions.html',
        controller: 'SessionsCtrl'
      }
    }
  })

  .state('app.editProfile', {
    url: '/editProfile',
    abstract: true,
    views: {
      'editProfile': {
        template: '<ion-nav-view></ion-nav-view>'
      }
    }
  })

  .state('app.editProfile.index', {
    url: '',
    templateUrl: 'components/editProfile/editProfile.html',
    controller: 'editProfileCtrl'
  })

  .state('app.editProfile.addEvent', {
    url: '/addEvent',
    templateUrl: 'components/addEvent/addEvent.html',
    controller: 'addEventCtrl'
  })

  .state('app.session', {
    url: '/sessions/:sessionId',
    views: {
      'session': {
        templateUrl: 'components/session/session.html',
        controller: 'SessionCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/artists');
});
