angular.module('starter.session', ['starter.services', 'ngOpenFB'])


.controller('SessionCtrl', function($scope, $stateParams, Session) {
  $scope.session = Session.get({sessionId : $stateParams.sessionId});
});