'use strict';

// Declare app level module which depends on views, and components
angular.module('happinessometer', [
  'ngRoute',
  'ngMaterial',
  'happinessometer.view1',
  'happinessometer.allMood'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
