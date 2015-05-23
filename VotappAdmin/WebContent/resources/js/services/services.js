'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('app.services', []).
value('version', '0.1')
.factory('ConsultoraFactory',['$http', function($http) {
	return{
		getConsultora:function(idConsultora){
			return $http.get('http://localhost:8080/Votapp/services/consultoras/'+idConsultora)
		},
		crearUsuario:function(user){
			console.log(user);
			return $http.post('http://localhost:8080/Votapp/services/usuario/protected/crear', user)
		}
	}
	
	
	
	
}])

.factory('LoginFactory', ['$http',function($http) {
	return{
		login:function(user){
			return $http.post('http://localhost:8080/Votapp/services/usuario/loginAdmin', user)
		}
	}
}])

.factory('UsuarioFactory', ['$http',function($http) {
	
}])