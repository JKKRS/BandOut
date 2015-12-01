angular.module('starter.yourEvents', [])

.controller('yourEventsCtrl', yourEventsCtrl);

function yourEventsCtrl($scope, $ionicListDelegate, User, $state, $stateParams, UserService) {

  $scope.$on('$stateChangeSuccess',
  function(event, toState, toParams, fromState, fromParams) {
    $scope.init();
  });

  $scope.init = function() {
    UserService.getUser().then(function(res) {
      if (res.artist_info) {
        $scope.user = res.artist_info.upcoming_events;
      } else {
        $scope.user = [];
      }
    });
  };

  $scope.editDetail = function(event) {
    $state.go('app.editProfile.editEvent-editEvent', {
      event: event,
      eventId: event.id
    });
  };

  // Go to add event view
  $scope.create = function() {
    // TODO this shouldn't be passing just user events under the guise of
    // $scope.user
    // refactor to properly send events
    $state.go('app.editProfile.editEvent-addEvent', {
      user: $scope.user
    });
  };

  $scope.deleteEvent = function(event, $index) {
    UserService.getUser()
      .then(function(res) {
        res.artist_info.upcoming_events = res.artist_info.upcoming_events.filter(function(evt) {
          return JSON.stringify(evt) !== JSON.stringify(event);
        });
        $scope.user.splice($index, 1);
        $ionicListDelegate.closeOptionButtons()
        User.update({
          "fbid": res.fbid
        },res);
      });
  };
}
