angular.module('starter.editEventView', [])
  .controller('editEventViewCtrl', editEventViewCtrl);

function editEventViewCtrl($scope, $state, $stateParams) {
  $scope.event = $stateParams.event;
  $scope.event.title = "";
  $scope.user.venueName ="";
  $scope.user.date = null;
  // $scope.user.time = null
  // $scope.user.venueAddress = 
  // $scope.updateEvent = function() {
  //
  // };
}
