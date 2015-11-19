angular.module('starter.editEventView', [])
.controller('editEventViewCtrl', editEventViewCtrl);

function editEventViewCtrl ($scope, $state, $stateParams) {
  $scope.event = $stateParams.event;
}
