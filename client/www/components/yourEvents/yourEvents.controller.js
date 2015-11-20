angular.module('starter.yourEvents', [])

.controller('yourEventsCtrl', yourEventsCtrl);

function yourEventsCtrl($scope, User, $state, $stateParams, UserService) {
  UserService.getUser().then(function(res) {
    $scope.user = res.artist_info.upcoming_events;
  });

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

//   $scope.cancelShow = function() {
//     console.log("I'm a working button");
//   };
}
