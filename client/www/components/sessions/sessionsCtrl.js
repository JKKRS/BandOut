angular.module('starter.sessions', ['starter.services', 'ngOpenFB'])

.controller('SessionsCtrl', function($scope, Session) {
  $scope.sessions = Session.query();
})