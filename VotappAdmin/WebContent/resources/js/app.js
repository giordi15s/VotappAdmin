'use strict';


// Declare app level module which depends on filters, and services
angular.module('app', [
  'ngRoute',
  //'app.filters',
  'app.services',
  //'app.directives',
  'app.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {templateUrl: 'views/login.html', controller: 'LoginController'});
  $routeProvider.when('/consultora', {templateUrl: 'index2.html', controller: 'ConsultoraController'});
  $routeProvider.when('/', {templateUrl: 'views/login.html', controller: 'LoginController'});
  $routeProvider.when('/home', {templateUrl: 'views/home.html',  controller: 'HomeController'});
  $routeProvider.otherwise({redirectTo: '/', templateUrl: 'views/login.html'});
}]);


