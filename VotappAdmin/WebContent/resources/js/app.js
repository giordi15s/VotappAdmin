'use strict';


// Declare app level module which depends on filters, and services
angular.module('app', [
  'ui.bootstrap',
  'ui.router',
  'angular-storage',
  'angular-jwt',
  //'app.filters',
  'app.services',
  'ui.bootstrap',
  //'app.directives',
  'app.controllers'
])
.config(['$urlRouterProvider', '$stateProvider','jwtInterceptorProvider', '$httpProvider', function($urlRouterProvider, $stateProvider,jwtInterceptorProvider, $httpProvider) {
	
	$urlRouterProvider.otherwise('/');
	
	$stateProvider.state('login', {url: '/login', templateUrl: 'views/login.html', controller: 'LoginController'})
	.state('home', {url:'/', templateUrl: 'views/home.html',  controller: 'HomeController', data:{requiresLogin:true} })
	.state('crearConsultora', {url:'/crearConsultora', templateUrl: 'views/altaConsultora.html',  controller: 'ConsultoraController'})
	.state('crearEleccion', {url:'/crearEleccion', templateUrl: 'views/altaEleccion.html',  controller: 'ConsultoraController'})
    .state('crearEleccion.profile', { url: '/profile', templateUrl: 'views/form-profile.html'})
  
  jwtInterceptorProvider.tokenGetter = function(store){
	  return store.get('token');
  };
  
  $httpProvider.interceptors.push('jwtInterceptor');
  
}])

.run(['$rootScope','jwtHelper', 'store', '$state', function($rootScope, jwtHelper, store, $state){
	
	$rootScope.$on("$stateChangeStart", function (event, next, current) {
	    if (next.data && next.data.requiresLogin) {
	    	if(!store.get('token')){
	    		event.preventDefault();
	    		$state.go('login');
	    	}else{
	    		if(jwtHelper.isTokenExpired(store.get('token'))){
	    			event.preventDefault();
		    		$state.go('login');
	    		}
	    	}	    	 
	    }
	});
	
}])


