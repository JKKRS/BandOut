// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', [
  'ionic',
  'ionic.service.core',
  'ngCordova',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'starter.menu',
  'starter.fbLogin',
  'starter.artist',
  'starter.artists',
  'starter.editProfile',
  'starter.addEvent',
  'starter.eventView',
  'uiGmapgoogle-maps',
  'starter.mapBrowse',
  'starter.yourEvents',
  'starter.editEvent',
  'starter.goLive'
])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, authProvider, $httpProvider, jwtInterceptorProvider) {

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'components/menu/menu.html',
    controller: 'MenuCtrl',
    data: {
      requiresLogin: true
    }
  })

  .state('login', {
    url: '/',
    templateUrl: 'components/login/login.html',
    controller: 'LoginCtrl',
    data: {
      requiresLogin: false
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
      requiresLogin: true
    }
  })

  .state('app.browse', {
    url: '/browse',
    cache:false,
    views: {
      'browse': {
        templateUrl: 'components/browse/browse.html'
      }
    },
    controller:'MapCtrl',
    data: {
      requiresLogin: true
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
      requiresLogin: true
    }
  })

  .state('app.artists.index', {
    url: '',
    templateUrl: 'components/artists/artists.html',
    controller: 'ArtistsCtrl',
    data: {
      requiresLogin: true
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
      requiresLogin: true
    }
  })

  .state('app.goLive', {
    url: '/live',
    views: {
      'live': {
        templateUrl: 'components/goLive/goLive.html',
        controller: 'GoLiveCtrl'
      }
    }
  })

  .state('app.editProfile.index', {
    url: '',
    templateUrl: 'components/editProfile/editProfile.html',
    controller: 'editProfileCtrl'
  })

  .state('app.editProfile.editEvent-addEvent', {
    url: '/addEvent',
    params: {user: null},
    templateUrl: 'components/addEvent/addEvent.html',
    controller: 'addEventCtrl'
  })

  .state('app.editProfile.yourEvents', {
    url:'/editEvent',
    params:{user: null},
    templateUrl: 'components/yourEvents/yourEvents.html',
    controller:'yourEventsCtrl'
  })

  .state('app.editProfile.editEvent-editEvent', {
    url: '/:eventId',
    params: {event: null, eventId: null},
    templateUrl: 'components/editEvent/editEvent.html',
    controller: 'editEventCtrl'
  });

  //
  authProvider.init({
    domain: 'rso3.auth0.com',
    clientID: 'xjfTO2HFDpHNw34WPK1FUL5UBsczCXs6',
    loginState: 'login'
  });

  jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
    var idToken = store.get('token');
    var refreshToken = store.get('refreshToken');
    // If no token return null
    if (!idToken || !refreshToken) {
      return null;
    }
    // If token is expired, get a new one
    if (jwtHelper.isTokenExpired(idToken)) {
      return auth.refreshIdToken(refreshToken)
        .then(function(idToken) {
          store.set('token', idToken);
          return idToken;
        });
    } else {
      return idToken;
    }
  };

  $httpProvider.interceptors.push('jwtInterceptor');
  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show');
        return config;
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide');
        return response;
      }
    };
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/artists');

  $ionicConfigProvider.platform.android.tabs.position('bottom').style('standard');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('true');

  $ionicConfigProvider.platform.ios.form.toggle('small');
})

.run(function($ionicPlatform, $rootScope, $state, $location, UserService, auth, store, jwtHelper, $ionicLoading) {
  $ionicPlatform.ready(function() {
    auth.hookEvents();

    // push notifications
    var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device Token:", token.token);
    });
  });

  $ionicPlatform.on("resume", function() {
  });

  //Loading Overlay
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({template: '<ion-spinner icon = "lines"></ion-spinner>'});
  });

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  });

  // Authentication Check For UI-Router
  $rootScope.$on("$stateChangeStart", function() {
    console.log('auth.isAuthenticated:', auth.isAuthenticated);
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          $state.go('login');
        }
      }
    }
  });
});
