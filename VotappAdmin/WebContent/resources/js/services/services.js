'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('app.services', []).
value('version', '0.1')
.factory('ConsultoraFactory',['$http', 'ApiEndpointFactory', function($http, ApiEndpointFactory) {
	return{
		getConsultora:function(idConsultora){
			return $http.get(ApiEndpointFactory.ApiEndpoint +'/Votapp/services/consultoras/'+idConsultora)
		},
		crearConsultora:function(dataConsultora){
			var dataConsultoraEnvio = {
					nombreAdminConsultora : dataConsultora.nombreAdminConsultora,
					username : dataConsultora.username,
					nombre : dataConsultora.nombre,
					descripcion : dataConsultora.descripcion,
					nombreAdminConsultora : dataConsultora.nombreAdminConsultora,
					passAdminConsultora: dataConsultora.passAdminConsultora,
					email : dataConsultora.email
			}
			
			dataConsultoraEnvio.passAdminConsultora = CryptoJS.SHA256(dataConsultora.passAdminConsultora).toString(CryptoJS.enc.Hex);
			return $http.post(ApiEndpointFactory.ApiEndpoint +'/Votapp/services/consultoras/protected/crear', dataConsultoraEnvio)
		},
		enviarMailConsultora:function(dataConsultora){
			return $http.post(ApiEndpointFactory.ApiEndpoint +'/Votapp/services/consultoras/protected/enviarMailConsultora', dataConsultora)
			
		},
		existeUsuario : function(username){
			return $http.post(ApiEndpointFactory.ApiEndpoint + '/Votapp/services/consultoras/protected/existeUsuario', username)
		}
		
	}	
	
	
}])

.factory('EleccionFactory',['$http', 'ApiEndpointFactory', function($http, ApiEndpointFactory) {
	var eleccionesABorrar = null;
    var promise = $http.get(ApiEndpointFactory.ApiEndpoint +'/Votapp/services/eleccion/getElecciones')
    .success(function (data) {
    	eleccionesABorrar = data;
    });
    
	return{
		promise:promise,
		getEleccionesABorrar: function () {
	          return eleccionesABorrar;//.getSomeData();
	      },
		crearEleccion:function(dataEleccion){
			return $http.post(ApiEndpointFactory.ApiEndpoint +'/Votapp/services/eleccion/protected/crear', dataEleccion)
		},
		getEleccionesActuales:function(){
			return $http.get(ApiEndpointFactory.ApiEndpoint +'/Votapp/services/eleccion/protected/getEleccionesActuales')
		},
		borrarEleccion : function(id){
			return $http.post(ApiEndpointFactory.ApiEndpoint +'/Votapp/services/eleccion/protected/borrar/'+ id)
		}
	}	
	
}])

.factory('LoginFactory', ['$http', 'ApiEndpointFactory', function($http, ApiEndpointFactory) {
	return{
		login:function(user){
			
			//Asi funciona la encriptacion:
			/*var objHashResult=CryptoJS.SHA256(user.password)
			var strHashResult=objHashResult.toString(CryptoJS.enc.Hex);
			console.log(strHashResult);*/
						
			var usuario = {
					password : CryptoJS.SHA256(user.password).toString(CryptoJS.enc.Hex),
					username : user.username
			}
			// Cree el objeto "usuario" para que el usuario no vea como se le cambia la contraseña a hex
			// ya que user.password esta bindeado con el <input> del password
			// y si hago user.password = CryptoJS.SHA256(user.password).toString(CryptoJS.enc.Hex)
			// el usuario lo ve x un momento
			

			return $http.post(ApiEndpointFactory.ApiEndpoint +'/Votapp/services/usuario/loginAdmin', usuario)
		}
	}
}])

.factory('FacebookFactory',['$http', function($http) {
	return{
		getPage:function(username){
			return $http.get('https://graph.facebook.com/v2.3/'+username+'?access_token=1007712492573393|EfLT3Ng0fwrOezKdxtlmTw8E45A')
		},
		getMyLastName: function() {
            FB.api('/suarez16luis', {
            	access_token: '1007712492573393|EfLT3Ng0fwrOezKdxtlmTw8E45A'
            }, function(response) {
                	return response;
            });
        }
	}
}])

.factory('ApiEndpointFactory', ['$http','$location', function($http, $location) {
	
	var ApiEndpoint = $location.protocol() + "://" + $location.host() + ":" + $location.port();
	
	return{
		ApiEndpoint : ApiEndpoint
	}	
	
}])






