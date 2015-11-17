// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', [
  'ionic',
  'starter.menu',
  'starter.fbLogin',
  'starter.artist',
  'starter.artists',
  'starter.editProfile',
  'starter.addEvent',
  'starter.eventView',
  'uiGmapgoogle-maps',
  'starter.mapBrowse'
])

.run(function($ionicPlatform, $rootScope, $state, UserService) {

  $ionicPlatform.ready(function() {
    facebookConnectPlugin.getLoginStatus(function(success) {
      if ((success.status === 'connected') && (UserService.userIsLoggedIn() === true)) {
        $state.go('app.artists');
      } else {
        $state.go('login');
      }
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $ionicPlatform.on("resume", function() {
    facebookConnectPlugin.getLoginStatus(function(success) {
      if ((success.status !== 'connected') || (UserService.userIsLoggedIn() === false)) {
        $state.go('login');
      }
    });
  });

  // Authentication Check For UI-Router
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    if (toState.data.authenticate) {
      facebookConnectPlugin.getLoginStatus(function(success) {
        if ((success.status === 'connected') && (UserService.userIsLoggedIn() === true)) {
          // proceed
        } else {
          event.preventDefault();
          $state.go('login');
        }
      }, function(err) {
          // err handle here
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'components/menu/menu.html',
    controller: 'MenuCtrl'
  })

  .state('login', {
    url: '/',
    templateUrl: 'components/login/login.html',
    controller: 'LoginCtrl',
    data: {
      authenticate: false
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'components/search/search.html'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.browse', {
    url: '/browse',
    views: {
      'browse': {
        templateUrl: 'components/browse/browse.html'
      }
    },
    controller:'MapCtrl',
    data: {
      authenticate: true
    }
  })

  .state('app.artists', {
    url: '/artists',
    abstract: true,
    views: {
      'artists': {
        template: '<ion-nav-view></ion-nav-view>'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.artists.index', {
    url: '',
    templateUrl: 'components/artists/artists.html',
    controller: 'ArtistsCtrl',
    data: {
      authenticate: true
    }
  })

  .state('app.artists.artist', {
    url: '/:artistId',
    params: {artist: null},
    templateUrl: 'components/artist/artist.html',
    controller: 'ArtistCtrl'
  })

  .state('app.artists.artist-event', {
    url: '/:eventId',
    params: {event: null},
    templateUrl: 'components/eventView/eventView.html',
    controller: 'eventViewCtrl'
  })

  .state('app.editProfile', {
    url: '/editProfile',
    abstract: true,
    views: {
      'editProfile': {
        template: '<ion-nav-view></ion-nav-view>'
      }
    },
    data: {
      authenticate: true
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
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

  $ionicConfigProvider.platform.android.tabs.position('bottom').style('standard');
});
