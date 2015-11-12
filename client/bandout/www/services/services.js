angular.module('starter.services', ['ngResource'])

.factory('Session', function($resource) {
  return $resource('http://localhost:4000/sessions/:sessionId');
});