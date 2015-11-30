angular.module('starter.yourEvents', [])

.controller('yourEventsCtrl', yourEventsCtrl);

function yourEventsCtrl($scope, User, $state, $stateParams, UserService) {

  $scope.$on('$stateChangeSuccess',
  function(event, toState, toParams, fromState, fromParams) {
    $scope.init();
  });

  $scope.init = function() {
    UserService.getUser().then(function(res) {
      if (res.artist_info) {
        $scope.user = res.artist_info.upcoming_events;
        console.log('User Events', res.artist_info.upcoming_events);
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

  $scope.deleteShow = function() {
    console.log("I'm a working button");
  };
}
