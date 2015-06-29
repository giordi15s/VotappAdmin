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


.controller('HomeController', ['$scope', 'ConsultoraFactory', 'EleccionFactory', '$filter', function($scope, ConsultoraFactory, EleccionFactory, $filter){
	var booleano = false;
	var eleccion = false;
	$scope.step = 1;
	$scope.partidos = [];
	$scope.listas = [];
	$scope.candidatos = [];
	$scope.selection = [];
	$scope.listasPorPartido = [];

	
	$scope.listasXPartido = function (){	
		$scope.listasPorPartido = [];
		for (var x=0;x<$scope.listas.length;x++){
			
			if($scope.listas[x].nombrePartido == $scope.formData.PartidoSeleccionado.nombre){
				var lis = {
					numero: $scope.listas[x].numero,
					nombrePartido:$scope.listas[x].nombrePartido 
				}
				$scope.listasPorPartido.push(lis);
			}
			
		}
		
	}
	
	//Arreglo de Candidatos creados en Wizard
	$scope.nuevoCandidato = function (formData){
		
		var fuentesDatosCandidato = [];
		
		var fuenteDatos = {
				url: formData.FNCandidato
		}
		fuentesDatosCandidato.push(fuenteDatos);
		var candidato =	{
			 nombre: $scope.formData.NombreCandidato,
			 edad: $scope.formData.EdadCandidato,
			 dataFuenteDatos: fuentesDatosCandidato,
			 dataListas: $scope.selection
		}
		$scope.candidatos.push(candidato);
		
		//Limpiar para el siguiente candidato:
		formData.NombreCandidato = "";
		formData.EdadCandidato = "";
		$scope.selection = [];
		formData.FNCandidato = "";
							
	}
	
	$scope.toggleSelection = function toggleSelection(listasPorPartido) {
	    var idx = $scope.selection.indexOf(listasPorPartido);

	    // is currently selected
	    if (idx > -1) {
	      $scope.selection.splice(idx, 1);
	    }

	    // is newly selected
	    else {
	      $scope.selection.push(listasPorPartido);
	    }
	  };

	//Arreglo de Listas creadas en Wizard
	$scope.nuevaLista = function (formData){
		
		var lista =
			{
			 numero: $scope.formData.NumeroLista,
			 nombrePartido: formData.PartidoSeleccionado.nombre
			}
		$scope.listas.push(lista);
		$scope.formData.NumeroLista ="";
		$scope.formData.PartidoSeleccionado = null;

	}
	
	//Arreglo de partidos creados en Wizard
	$scope.nuevoPartido = function (formData){
		var datefilter = $filter('date'),
	    formattedDate = datefilter($scope.formData.FechaPartido, 'yyyy/MM/dd');
		$scope.formData.FechaPartido = formattedDate;
		var dataFuenteDatos = [];
		
		var fuenteDatos = {
				url: $scope.formData.FNPartido,
		}		
		
		dataFuenteDatos.push(fuenteDatos);
		
		var partido = 
        {
	         nombre: $scope.formData.NombrePartido , 
	         fechaFundacion: new Date($scope.formData.FechaPartido),
	         presidente: $scope.formData.Presidente,
	         descripcion:$scope.formData.Descripcion,
	         dataFuenteDatos: dataFuenteDatos
        }
		$scope.partidos.push(partido);
		$scope.formData.NombrePartido="";
		$scope.formData.FechaPartido="";
		$scope.formData.Presidente="";
		$scope.formData.Descripcion="";
		$scope.formData.FNPartido="";		
		
	}
	
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
			$scope.activoPaso4 = false;
			$scope.activoPaso5 = false;
			break;
	    case 2:
	    	$scope.activoPaso1 = false;
			$scope.activoPaso2 = true;
			$scope.activoPaso3 = false;
			$scope.activoPaso4 = false;
			$scope.activoPaso5 = false;
			break;
	    case 3:
	    	$scope.activoPaso1 = false;
			$scope.activoPaso2 = false;
			$scope.activoPaso3 = true;
			$scope.activoPaso4 = false;
			$scope.activoPaso5 = false;
			break;
	    case 4:
	    	$scope.activoPaso1 = false;
			$scope.activoPaso2 = false;
			$scope.activoPaso3 = false;
			$scope.activoPaso4 = true;
			$scope.activoPaso5 = false;
			break;
	    case 5:
	    	$scope.activoPaso1 = false;
			$scope.activoPaso2 = false;
			$scope.activoPaso3 = false;
			$scope.activoPaso4 = false;
			$scope.activoPaso5 = true;
			break;
	
		default:
			$scope.activoPaso1 = false;
			$scope.activoPaso2 = false;
			$scope.activoPaso3 = false;
			$scope.activoPaso4 = false;
			$scope.activoPaso5 = false;
			break;
       }
      
       
   
       console.log("El valor de Step, es:"+step);
    } //Cambia las vistas del wizzard
	
	 $scope.formData = {};
	    
	    // function to process the form
	    $scope.processForm = function() {
	        alert('Eleccion creada!');
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
	
	//Se invoca desde el navbar para mostrar el Wizard
	$scope.crearEleccion = function(){
		eleccion = true;
		booleano = false;
		$scope.formData.PartidoSeleccionado = null;
		$scope.formData.Nombre="";
	}
	
	
	//Crea una nueva Eleccion
	$scope.altaEleccion = function(formData){
		
		var dataEleccion = {
				nombre: formData.Nombre,
				descripcion: formData.Descripcion,
				fecha: new Date(formData.Fecha),
				dataPartidos: $scope.partidos,
				dataListas: $scope.listas,
				dataCandidatos: $scope.candidatos,
				tipoEleccion: formData.tipoEleccion
		}
		
		EleccionFactory.crearEleccion(dataEleccion).then(
				function(response){
					
				},
				
				function(response){
					//error messagge
						
				}
		)
			
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