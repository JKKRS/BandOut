angular.module('main', [
  'ionic',
  'ionic.service.core',
  'ionic.closePopup',
  'ion-place-tools',
  'ngCordova',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'main.menu',
  'main.fbLogin',
  'main.artist',
  'main.artists',
  'main.editProfile',
  'main.addEvent',
  'main.eventView',
  'uiGmapgoogle-maps',
  'main.nearbyArtists',
  'main.yourEvents',
  'main.editEvent',
  'main.goLive',
  'main.favoriteDir',
  'main.artistList'
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
  });

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
})

.run(function($ionicPlatform, $rootScope, $state, $location, UserService, auth, store, jwtHelper, $ionicLoading, $ionicPopup, IonicClosePopupService, $window) {
  $ionicPlatform.ready(function() {
    auth.hookEvents();

    // push notifications
    var push = new Ionic.Push({
      debug: true,
      canShowAlert: true,
      canSetBadge: true,
      canRunActionsOnWake: true,
      onNotification: notificationHandler
    });

    push.register(function(token) {
      store.set('device_token', token.token);
    });
  });

  $ionicPlatform.on("resume", function() {
    console.log('ionicPlatform on resume called...');
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

  function notificationHandler(notification) {
    console.log('notification:', notification);

    IonicClosePopupService.register($ionicPopup.show({
      title: notification.title,
      template: notification.text,
      buttons: [
        {
          text: 'Tip Artist',
          type: 'button-positive',
          onTap: function(e) {
            var link = notification._raw.additionalData.paypal_link;
            $window.open(link, '_blank', 'location=yes');
          }
        }
      ]
    }));
  }
});
