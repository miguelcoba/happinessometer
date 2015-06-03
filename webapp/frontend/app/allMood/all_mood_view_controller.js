'use strict';

angular.module('happinessometer.allMood', ['ngRoute', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider, $ngMaterial) {
  $routeProvider.when('/allMood', {
    templateUrl: 'allMood/all_mood_view.html',
    controller: 'AllMoodCtrl'
  });
}])

.controller('AllMoodCtrl', [function() {

}]);