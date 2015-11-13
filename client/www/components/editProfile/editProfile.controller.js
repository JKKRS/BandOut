angular.module('starter.editProfile', [])

.controller('editProfileCtrl', editProfileCtrl);

function editProfileCtrl($scope, $state) {
  $scope.user = {};
  $scope.user.artist = false;
  $scope.user.name = "";
  $scope.user.email = "";
  $scope.user.twitter = "";
  $scope.user.paypal = "";
  $scope.user.website = "";
  $scope.create = function() {
    $state.go('app.editProfile.addEvent');
  };
}
