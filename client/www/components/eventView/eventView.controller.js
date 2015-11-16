angular.module('starter.eventView', [])

.controller('eventViewCtrl', eventViewCtrl);

function eventViewCtrl($scope, $stateParams) {
  $scope.event = $stateParams.event;
}
