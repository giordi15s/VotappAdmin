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
  'app.controllers',
  'ngAnimate',
  'flow'
])
.config(['$urlRouterProvider', '$stateProvider','jwtInterceptorProvider', '$httpProvider', function($urlRouterProvider, $stateProvider,jwtInterceptorProvider, $httpProvider) {
	
	$urlRouterProvider.otherwise('/');
	
	$stateProvider.state('login', {url: '/login', templateUrl: 'views/login.html', controller: 'LoginController'})
	.state('home', {url:'/',  controller: 'HomeController', data:{requiresLogin:true} })
	.state('crearConsultora', {url:'/crearConsultora', templateUrl: 'views/altaConsultora.html',  controller: 'ConsultoraController', data:{requiresLogin:true}})
	.state('crearEleccion', {url:'/crearEleccion', templateUrl: 'views/altaEleccion.html',  controller: 'EleccionController', data:{requiresLogin:true}})    
	.state('borrarEleccion', {url:'/borrarEleccion', templateUrl: 'views/borrarEleccion.html',  controller: 'EleccionController', data:{requiresLogin:true}})    

  jwtInterceptorProvider.tokenGetter = function(store){
	  return store.get('token');
  };
  
  $httpProvider.interceptors.push('jwtInterceptor');
  
}])

.run(['$rootScope','jwtHelper', 'store', '$state', '$stateParams', function($rootScope, jwtHelper, store, $state, $stateParams){
	$rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
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


