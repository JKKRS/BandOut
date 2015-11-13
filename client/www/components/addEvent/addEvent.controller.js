angular.module('starter')

.controller('addEventCtrl', addEventCtrl);

function addEventCtrl($scope) {
  $scope.event = {};
}
