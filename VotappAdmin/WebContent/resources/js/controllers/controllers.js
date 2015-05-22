'use strict';

angular.module("app.controllers",[])
.controller("LoginController", ['$scope', 'LoginFactory', '$location', function($scope, LoginFactory, $location){
	
	$scope.signin = function(){
		
		$location.url("/home");
	
	}
	
}])
.controller('ConsultoraController', ['$scope', 'ConsultoraFactory', function($scope, ConsultoraFactory) {
	
	$scope.updateResultado = function(consultoraId){
		
		ConsultoraFactory.getConsultora(consultoraId).then(
				function(response){
					console.log(response.data);
				},
				
				function(response){
					//error messagge
					console.log(response.data);
				}
		)
		
	};
	

	
	
	//$scope.updateResultado(1); //valor inicial de la consulta
	
}])


.controller('HomeController', ['$scope', 'ConsultoraFactory', function($scope, ConsultoraFactory){
	var booleano = false;
	
	$scope.mostrarFormulario = function(){
		return booleano;
		
	}
	
	$scope.crearConsultora = function(){
		console.log("Clikeado");
		booleano = true;
	}
	
	$scope.crearUsuario = function(consultora){
		console.log("Entro a Crear usuarioooo");
		console.log(consultora);
		
		
		ConsultoraFactory.crearUsuario(consultora).then(
				function(response){
					
				},
				
				function(response){
					//error messagge
						
				}
		)
		
	};
	
	
}])

.controller('UsuarioController', ['$scope', 'UsuarioFactory', function($scope, UsuarioFactory) {
	

	
	
	//$scope.updateResultado(1); //valor inicial de la consulta
	
}])