angular.module('starter.addEvent', [])

.controller('addEventCtrl', addEventCtrl);

function addEventCtrl($scope) {
  $scope.event = {};
}
