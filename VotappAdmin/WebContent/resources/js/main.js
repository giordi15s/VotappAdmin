//var app = angular.module("app", ['ngRoute']);
/*
app.controller('firstController', ['$scope','$http', function($scope, $http){
		
	$scope.updateResultado = function(){
		
		$http.get('http://localhost:8080/Votapp/services/consultoras/'+$scope.idConsultora)
			.success(function(data){
				$scope.nombreConsultora = data.nombre;
				$scope.descConsultora = data.descripcion;				
			})
			.error(function(data, status, headers, config){
				alert("Ha fallado la petición. Estado HTTP:"+status);				
			})
	}
	
}])
*/
/*app.config(["$routeProvider", function($routeProvider){

	$routeProvider.when("/login", {
		templateUrl: "views/login.html"
	}).otherwise({
		redirectTo:"/",
		templateUrl:"views/home.html"
	})

}])
*/