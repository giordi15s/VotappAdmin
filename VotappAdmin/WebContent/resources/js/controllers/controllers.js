'use strict';

angular.module("app.controllers",[
'angular-storage'
])
.controller("LoginController", ['$scope', 'LoginFactory', '$state', 'store',function($scope, LoginFactory, $state, store){
	$scope.user = {};
	$scope.signin = function(){
		LoginFactory.login($scope.user).then(
				function(response){			
					$scope.user.password = ""; // Borrar la contraseña, ya que solo se necesita el token
					store.set('token', response.data);
					$state.go("home");
				},
				
				function(response){
					//error messagge
					console.log(response.data);
				}
			)	
	
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
	var eleccion = false;
	$scope.step = 1;
	
	$scope.datePicker = {
		isOpen : false	
	}
	
	
    $scope.setStep = function(step){
       $scope.step = step;
       
       switch (step) {
	    case 1:
			$scope.activoPaso1 = true;
			$scope.activoPaso2 = false;
			$scope.activoPaso3 = false;
			break;
	    case 2:
	    	$scope.activoPaso1 = false;
			$scope.activoPaso2 = true;
			$scope.activoPaso3 = false;
			break;
	    case 3:
	    	$scope.activoPaso1 = false;
			$scope.activoPaso2 = false;
			$scope.activoPaso3 = true;
			break;
	
		default:
			$scope.activoPaso1 = false;
			$scope.activoPaso2 = false;
			$scope.activoPaso3 = false;
			break;
       }
      
       
   
       console.log("El valor de Step, es:"+step);
    } //Cambia las vistas del wizzard
	
	 $scope.formData = {};
	    
	    // function to process the form
	    $scope.processForm = function() {
	        alert('awesome!');
	    };
	
	$scope.mostrarFormulario = function(){
		return booleano;
		
	}
	
	$scope.showFormulario = function(){
		return eleccion;
		
	}
	
	$scope.crearConsultora = function(){		
		booleano = true;
		eleccion = false;
	}
	
	$scope.crearEleccion = function(){
		eleccion = true;
		booleano = false;
		
	}
	
	$scope.today = function() {
	    $scope.dt = new Date();
	  };
	  $scope.today();

	  $scope.clear = function () {
	    $scope.dt = null;
	  };


	  $scope.toggleMin = function() {
	    $scope.minDate = $scope.minDate ? null : new Date();
	  };
	  $scope.toggleMin();

	  $scope.openDatePicker = function($event) {
		  $event.preventDefault();
		  $event.stopPropagation();
		 
		     $scope.datePicker.isOpen = true;  
		 
		};

	  $scope.dateOptions = {
	    formatYear: 'yy',
	    startingDay: 1
	  };

	  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];

	  var tomorrow = new Date();
	  tomorrow.setDate(tomorrow.getDate() + 1);
	  var afterTomorrow = new Date();
	  afterTomorrow.setDate(tomorrow.getDate() + 2);
	  $scope.events =
	    [
	      {
	        date: tomorrow,
	        status: 'full'
	      },
	      {
	        date: afterTomorrow,
	        status: 'partially'
	      }
	    ];

	  $scope.getDayClass = function(date, mode) {
	    if (mode === 'day') {
	      var dayToCheck = new Date(date).setHours(0,0,0,0);

	      for (var i=0;i<$scope.events.length;i++){
	        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

	        if (dayToCheck === currentDay) {
	          return $scope.events[i].status;
	        }
	      }
	    }

	    return '';
	  };
	
	$scope.crearUsuario = function(consultora){
				
		ConsultoraFactory.crearConsultora(consultora).then(
				function(response){
					
				},
				
				function(response){
					//error messagge
						
				}
		)
		
	};
	
	
}])

.controller('UsuarioController', ['$scope', 'UsuarioFactory', function($scope, UsuarioFactory) {
	

			
	
}])