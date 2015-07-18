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

.controller('HeaderController', ['$scope', 'LoginFactory', '$state', function($scope, LoginFactory, $state){

	$scope.mostrarHeader = function(){
		if($state.current.name ==='home' || $state.current.name ==='crearConsultora' || $state.current.name ==='crearEleccion')
			return true;
		else
			return false;
	}
	
}])

.controller('HomeController', ['$scope', function($scope){
		
	
}])

.controller('EleccionController', ['$scope', 'ConsultoraFactory', 'EleccionFactory', '$filter', '$modal',function($scope, ConsultoraFactory, EleccionFactory, $filter, $modal) {
	
	$scope.seleccion = {eleccion : null};
	$scope.step = 1;
	$scope.partidos = [];
	$scope.listas = [];
	$scope.candidatos = [];
	$scope.selection = [];
	$scope.listasPorPartido = [];
	$scope.noticiasPartidos = [];
	$scope.noticiasCandidato = [];
	var esNacional = false;
	var mostrarListas = false;
	var esOtra = true;
	var salteo = null;
	$scope.numeroPaso3 = 3;
	$scope.numeroPaso4 = 4;
	$scope.numeroPaso5 = 5;
	$scope.siguientePaso1 = 2;
	$scope.deptos = [];
	var fuenteXPartido = false;
	var deptosYnoticias = false;
	$scope.esDepartamental = false; 
	$scope.DeptoPartido = [];
	
	$scope.deptos.push("Artigas")
	$scope.deptos.push("Cerro Largo")
	$scope.deptos.push("Durazno")
	$scope.deptos.push("Florida")
	$scope.deptos.push("Maldonado")
	$scope.deptos.push("Paysandú")
	$scope.deptos.push("Rivera")
	$scope.deptos.push("Salto")
	$scope.deptos.push("Soriano")
	$scope.deptos.push("Treinta y Tres")
	$scope.deptos.push("Canelones")
	$scope.deptos.push("Colonia")
	$scope.deptos.push("Flores")
	$scope.deptos.push("Lavalleja")
	$scope.deptos.push("Montevideo")
	$scope.deptos.push("Río Negro")
	$scope.deptos.push("Rocha")
	$scope.deptos.push("San José")
	$scope.deptos.push("Tacuarembó")
	$scope.primerCargo = "Presidente";
	
	
	$scope.hayFuentes = function (){
		var hayFuentes = false; 
		
		if($scope.noticiasPartidos.length<1){
			hayFuentes = false;
			console.log("Nticiassss Llenas:"+$scope.noticiasPartidos);
		}
		else{
			hayFuentes = true;
			console.log("Noticiasss Vacias"+$scope.noticiasPartidos);
		}
	
		return hayFuentes;
	}
	
	
	$scope.listasXDeptos = function(){
	
		$scope.listasPorPartido = [];
	
		for (var x=0;x<$scope.listas.length;x++){
			if (($scope.listas[x].nombrePartido==$scope.formData.PartidoCandidato.nombre)&&
					($scope.listas[x].dataDepartamento.nombre==$scope.formData.DeptoPartido.nombre)){
				
				$scope.listasPorPartido.push($scope.listas[x]);
			}
		
		}
	}
	
	$scope.deptoXPartidoCandidato = function(){
		$scope.listasPorPartido = [];
		$scope.DeptoPartido =  $scope.formData.PartidoCandidato.dataDeptos;
	}
	
	$scope.deptoXPartido = function (){
		$scope.departamentoPartido = $scope.formData.PartidoSeleccionado.dataDeptos;
		
		
	}
		
	$scope.deptosYNoticias = function (){
		return deptosYnoticias;
	}
	
	
	$scope.fuentePorPartido = function (){
		return fuenteXPartido;
	}
	
	//oculta el paso 2 del wizard si la eleccion es Otra
	$scope.eleccionOtra = function(){
		return esOtra;
	}

	$scope.nuevaFuente =function (){
		
		var fuente = {
			tipo: $scope.formData.tipoFuente,
			url:  $scope.formData.FNPartido
		}
		$scope.noticiasPartidos.push(fuente);
		$scope.formData.FNPartido = "";
	}
	
	$scope.nuevaFuenteCandidato =function (){
		
		var fuente = {
			tipo: $scope.formData.tipoFuenteCandidato,
			url:  $scope.formData.FNCandidato
		}
		$scope.noticiasCandidato.push(fuente);
		$scope.formData.FNCandidato = "";
	}
	
	
	$scope.mostrarListas = function(){
		return mostrarListas;
	}
	
	$scope.tipoEleccionSel = function(){
		  
	       switch ($scope.formData.tipoEleccion) {
	       
		    case "Nacional":
		    	$scope.primerCargo = "Presidente";
		    	$scope.segundoCargo = "Vicepresidente";
		    	$scope.esDepartamental = false; 
		    	deptosYnoticias = false;
		    	fuenteXPartido = true;
				esNacional = true;
				mostrarListas = false;
				esOtra = true;
				$scope.numeroPaso3 = 3;
				$scope.numeroPaso4 = 4;
				$scope.numeroPaso5 = 5;
				$scope.siguientePaso1 = 2;
				break;
				
		    case "Departamental":
		    	$scope.primerCargo = "Intendente";
		    	$scope.esDepartamental = true; 
		    	deptosYnoticias = true;
		    	fuenteXPartido = false;
				esNacional = false;
				mostrarListas = true;
				esOtra = true;
				$scope.numeroPaso3 = 3;
				$scope.numeroPaso4 = 4;
				$scope.numeroPaso5 = 5;
				$scope.siguientePaso1 = 2;
//				$scope.formData.FNPartido = "vacio"
				break;

		    case "Otra":
		    	$scope.primerCargo = "Presidente";
		    	$scope.segundoCargo = "Vicepresidente";
		    	$scope.esDepartamental = false; 
		    	esNacional = false;
		    	mostrarListas = true;
		    	esOtra = false;
		    	$scope.numeroPaso3 = 2;
		    	$scope.numeroPaso4 = 3;
		    	$scope.numeroPaso5 = 4;
		    	$scope.siguientePaso1 = 3;
		    	break;
		    
			default:
				deptosYnoticias = false;
	    		fuenteXPartido = true;
				esNacional = false;
				mostrarListas = false;
				esOtra = true;
				$scope.numeroPaso3 = 3;
				$scope.numeroPaso4 = 4;
				$scope.numeroPaso5 = 5;
				$scope.siguientePaso1 = 2;
				break;
	       }
			
	}
	
	$scope.listasXPartido = function (){	
		$scope.listasPorPartido = [];
		for (var x=0;x<$scope.listas.length;x++){
			
			if($scope.listas[x].nombrePartido == $scope.formData.PartidoCandidato.nombre){
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
		
		var candidato =	{
			 nombre: $scope.formData.NombreCandidato,
			 edad: $scope.formData.EdadCandidato,
			 dataFuenteDatos: $scope.noticiasCandidato,
			 dataListas: $scope.selection,
			 nombrePartido: formData.PartidoCandidato.nombre,
			 cargo : formData.cargo.toUpperCase()
		}
		$scope.candidatos.push(candidato);
		
		//Limpiar para el siguiente candidato:
		formData.NombreCandidato = "";
		formData.EdadCandidato = "";
		$scope.selection = [];
		formData.FNCandidato = "";
		formData.PartidoCandidato = "";
							
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
			 dataDepartamento: formData.DeptoLista,	
			 numero: $scope.formData.NumeroLista,
			 nombrePartido: formData.PartidoSeleccionado.nombre
			}
		$scope.listas.push(lista);
		$scope.formData.NumeroLista ="";
		$scope.formData.PartidoSeleccionado = null;
		$scope.formData.DeptoLista = null;
	}
	
	//Arreglo de partidos creados en Wizard
	$scope.nuevoPartido = function (formData){
		var datefilter = $filter('date'),
	    formattedDate = datefilter($scope.formData.FechaPartido, 'yyyy/MM/dd');
		$scope.formData.FechaPartido = formattedDate;
			
		var partido = 
        {
	         nombre: $scope.formData.NombrePartido , 
	         fechaFundacion: new Date($scope.formData.FechaPartido),
	         presidente: $scope.formData.Presidente,
	         descripcion:$scope.formData.Descripcion,
	         dataFuenteDatos: $scope.noticiasPartidos,
	         dataDeptos: $scope.selectedDeptos

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
	    	if (!$scope.eleccionOtra){
	    		$scope.setStep(3)
	    	}
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
      
    } //Cambia las vistas del wizzard
	
	 $scope.formData = {};
	    
	    // function to process the form
	    $scope.processForm = function() {
	        alert('Eleccion creada!');
	    };
	
	//Se invoca desde el navbar para mostrar el Wizard
	$scope.crearEleccion = function(){		
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
	  
	  
	  /*Funcion para abrir el 1er modal*/
	
	  $scope.openModal = function () {
			
		    var modalInstance = $modal.open({
		      templateUrl: 'views/DeptosNoticiasModal.html',
		      controller: 'ModalInstanceCtrl',		      
		      resolve: {
		    	  deptos: function(){
		    		  return $scope.deptos;
		        }
		      }
		    });
		    
		    modalInstance.result.then(
		    	function (listaDeptos) {
		    		$scope.selectedDeptos = listaDeptos;
		    	},
		      	function () {
		        //$log.info('Modal dismissed at: ' + new Date());
		      }
		    );
	  };
		
		
}])

.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'deptos', '$modal', function($scope, $modalInstance, deptos, $modal) {
	
	$scope.deptos = deptos; //Todos los *nombres* de los departamentos existentes
	$scope.selectionDeptos = []; //Los departamentos seleccionados (x nombre)
	$scope.seleccion = {eleccion : null};
	$scope.departamentosSeleccionados = []; //Son los *objetos* departamentos
			
	/*Funcion para abrir el 2do modal*/
	$scope.openModalFuente = function (deptoNombre) {			
		var modalInstance = $modal.open({		     
				templateUrl: 'views/DeptosNoticiasModal2.html',
				controller: 'ModalInstanceFuenteCtrl',		      
				resolve: {
					deptos: function () {
						return $scope.deptos;
					},
				}
		    });
		    
		    modalInstance.result.then(
		    	function (listaFuentes) {
		    		
		    		var departamento = {
			    			nombre : deptoNombre,
			    			listaFuenteDatos : listaFuentes
			    	}
			    	$scope.departamentosSeleccionados.push(departamento);
		    	},
		    	function () {
		        //$log.info('Modal dismissed at: ' + new Date());
		      });
		};
	
	$scope.toggleSelection = function toggleSelection(deptoNombre) {		
		
		var idx = $scope.selectionDeptos.indexOf(deptoNombre);

	    if (idx > -1) {
	    	$scope.selectionDeptos.splice(idx, 1);
	    	//Ahora tmb se tiene que quitar del arreglo de $scope.departamentosSeleccionados
	    	// Debo obtener el index de dicho arreglo q tenga a departamento.nombre == deptoNombre
	    	var index = getIndicePorNombre(deptoNombre);
	    	$scope.departamentosSeleccionados.splice(index, 1);
	    }

	    else {
	    	$scope.selectionDeptos.push(deptoNombre);
	    	$scope.openModalFuente(deptoNombre);	    	
	    }
	};
	
	function getIndicePorNombre(deptoNombre){
		var indice = 0;
		var encontre = false;
		while (!encontre) {
			if($scope.departamentosSeleccionados[indice].nombre == deptoNombre){
				encontre = true;
			}else{
				indice++;
			}
		}
		
		return indice;
	}
	
	
	$scope.ok = function () {
		$modalInstance.close($scope.departamentosSeleccionados);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	
		
}])

.controller('ModalInstanceFuenteCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
	
	$scope.listaFuentes = [];
	
	$scope.crearFuenteDepto = function (){
		
		var DataFuenteDatos = {
			url: $scope.formData.FNDepto,	
			tipo: $scope.formData.tipoFuente	
		}		
		$scope.listaFuentes.push(DataFuenteDatos)		
		
		$scope.formData.FNDepto = ""
		$scope.formData.tipoFuente = ""	
	
	}	
	
	$scope.finCrearFuentes = function () {
		$modalInstance.close($scope.listaFuentes);
	};
	
	$scope.hayFuentes = function (){
		var hayFuentes = false; 
		
		if($scope.listaFuentes.length<1){
			hayFuentes = false;
			console.log("Nticiassss Llenas:"+$scope.listaFuentes);
		}
		else{
			hayFuentes = true;
			console.log("Noticiasss Vacias"+$scope.listaFuentes);
		}
	
		return hayFuentes;
	}
	
}])















