angular.module('starter.yourEvents', [])

.controller('yourEventsCtrl', yourEventsCtrl);

function yourEventsCtrl($scope, User, $state, $stateParams, UserService) {

  $scope.$on('$stateChangeSuccess',
  function(event, toState, toParams, fromState, fromParams) {
    $scope.init();
  });

  $scope.init = function() {
    UserService.getUser().then(function(res) {
      $scope.user = res.artist_info.upcoming_events;
    });
  }

  $scope.editDetail = function(event) {
    $state.go('app.editProfile.editEvent-editEvent', {
      event: event,
      eventId: event.id
    });
  };

  // Go to add event view
  $scope.create = function() {
    $state.go('app.editProfile.editEvent-addEvent', {
      user: $scope.user
    });
  };

  $scope.deleteShow = function() {
    console.log("I'm a working button");
  };
}
