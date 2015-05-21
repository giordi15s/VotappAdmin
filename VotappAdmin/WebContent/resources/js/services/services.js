'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('app.services', []).
value('version', '0.1')
.factory('ConsultoraFactory',['$http', function($http) {
	return{
		getConsultora:function(idConsultora){
			return $http.get('http://localhost:8080/Votapp/services/consultoras/'+idConsultora)
		}
	}
	
}])

.factory('LoginFactory', ['$http',function($http) {
	return{
		
	}
}])