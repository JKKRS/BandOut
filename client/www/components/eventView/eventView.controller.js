angular.module('starter.eventView', [])

.controller('addEventCtrl', eventViewCtrl);

function eventViewCtrl($scope) {
  $scope.event = {};
}
