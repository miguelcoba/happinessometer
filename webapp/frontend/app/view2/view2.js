'use strict';

angular.module('myApp.view2', ['ngRoute', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider, $ngMaterial) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', [function() {

}]);