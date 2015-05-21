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
					$scope.consultora.nombre = response.data.nombre;
					$scope.consultora.descripcion = response.data.descripcion;
				},
				
				function(response){
					//error messagge
				}
		)
		
	};
	
	//$scope.updateResultado(1); //valor inicial de la consulta
	
}])


.controller('HomeController', ['$scope', function($scope){
	var booleano = false;
	
	$scope.mostrarFormulario = function(){
		console.log("Holaaaaaaaaaa");
		return booleano;
		
	}
	
	$scope.crearConsultora = function(){
		console.log("Clikeado");
		booleano = true;
	}
	
	
	
	
	
}])