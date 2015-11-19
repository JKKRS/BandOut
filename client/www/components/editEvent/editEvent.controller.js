angular.module('starter.editEvent', [])

.controller('editEventCtrl', editEventCtrl);

function editEventCtrl($scope, User, $stateParams, UserService) {
  UserService.getUser().then(function(res) {
    console.log(res);
  })
}
