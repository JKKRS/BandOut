angular.module('starter.editEvent', [])

.controller('editEventCtrl', editEventCtrl);

function editEventCtrl($scope, User, $state, $stateParams, UserService) {
  UserService.getUser().then(function(res) {
    $scope.user = res.artist_info.upcoming_events;
    console.log("editEventCtrl,", $scope.user);
  });

  $scope.editDetail = function(event){
    $state.go('app.editProfile.editEvent-editEventView', {event:event, eventId: event.id});
  };

  // Go to add event view
  $scope.create = function() {
    $state.go('app.editProfile.editEvent-addEvent', {
      user: $scope.user
    });
  };

}
