angular.module('starter')

.controller('editProfileCtrl', function($scope) {
  $scope.user = {};
  $scope.user.artist = false;
  $scope.user.name = "";
  $scope.user.email = "";
  $scope.user.twitter = "";
  $scope.user.paypal = "";
  $scope.user.website = "";

});
