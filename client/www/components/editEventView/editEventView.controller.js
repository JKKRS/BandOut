angular.module('starter.editEventView', ['uiGmapgoogle-maps'])
  .controller('editEventViewCtrl', editEventViewCtrl);

function editEventViewCtrl($scope, $state, User, UserService, $stateParams) {
  $scope.event = $state.params.event;

  $scope.updateEvent = function() {
    console.log("I will be functional");
  };
}

function NewEvent(id, title, datetime, description, venue) {
  var newEvent = Object.create(Object.prototype);
  newEvent = {
    "id": id,
    "title": title,
    "datetime": datetime,
    "description": description,
    "venue": venue
  };
  return newEvent;
}

function NewVenue(name, address, zip, city, latit, longit) {
  var newVenue = Object.create(Object.prototype);
  newVenue = {
    "name": name,
    "address": address,
    "zip": zip,
    "city": city,
    "country": "",
    "latitude": latit,
    "longitude": longit
  };
  return newVenue;
}
