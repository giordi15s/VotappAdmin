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

	$scope.alerts = [];
	$scope.isCollapsed = true;
	$scope.crearUsuario = function(consultora){
		
		if (consultora.nombreAdminConsultora == "" || consultora.passAdminConsultora =="" || consultora.nombre=="" || consultora.descripcion==""){
			
			swal("Todos los campos son obligatorios!");
			
		}
		else{
		
		ConsultoraFactory.crearConsultora(consultora).then(
				function(response){
					ConsultoraFactory.enviarMailConsultora(consultora);
					
					swal("Consultora creada!","","success");
					
				},
				
				function(response){
					//error messagge
					sweetAlert("Oops...", "Error al crear consultora!", "error");
										 
				}
		)
		}
	};
	
	$scope.existeUsuario = function(){
		ConsultoraFactory.existeUsuario($scope.consultora.nombreAdminConsultora).then(
				function(response){
					if(response.data === true)
						$scope.isCollapsed = false;
					else
						$scope.isCollapsed = true;
				},
				function(response){
					console.log("Error en validacion de usuario: "+ response.data)
				}
			)
	}
	
}])

.controller('HeaderController', ['$scope', 'LoginFactory', '$state', 'store', function($scope, LoginFactory, $state, store){

	$scope.mostrarHeader = function(){
		if($state.current.name ==='home' || $state.current.name ==='crearConsultora' || $state.current.name ==='crearEleccion' || $state.current.name ==='borrarEleccion')
			return true;
		else
			return false;
	}
	
	$scope.logout = function() {
		store.remove('token');
		$state.go('login');
	}
	
}])

.controller('HomeController', ['$scope', function($scope){
		
	
}])

.controller('EleccionController', ['$scope', 'ConsultoraFactory', 'EleccionFactory', '$filter', '$modal',function($scope, ConsultoraFactory, EleccionFactory, $filter, $modal) {
	
	$scope.alerts = [];
	$scope.seleccion = {eleccion : null};
	$scope.step = 1;
	$scope.partidos = [];
	$scope.listas = [];
	$scope.candidatos = [];
	$scope.selection = [];
	$scope.selectionParaOtro = [];
	$scope.listasPorPartido = [];
	$scope.noticiasPartidos = [];
	$scope.noticiasPartidosReal = [];
	$scope.noticiasCandidato = [];
	$scope.noticiasDelSi = [];
	$scope.noticiasDelNo = [];
	$scope.noticiasEleccion = [];
	var esNacional = false;
	var mostrarListas = false;
	var mostrarListasOtra = false;
	var esOtra = true;
	var salteo = null;
	$scope.numeroPaso3 = 3;
	$scope.numeroPaso4 = 4;
	$scope.numeroPaso5 = 5;
	$scope.numeroPaso6 = 6;
	$scope.siguientePaso1 = 2;
	$scope.deptos = [];
	var fuenteXPartido = false;
	var deptosYnoticias = false;
	$scope.esFacebook = false;
	$scope.esTwitter = false;
	$scope.esYoutube = false;
	$scope.esFacebookCandi = false;
	$scope.esTwitterCandi = false;
	$scope.esYoutubeCandi = false;
	$scope.esDepartamental = false; 
	$scope.esFacebookElecc = false;
	$scope.esTwitterElecc = false;
	$scope.esYoutubeElecc = false;
	$scope.DeptoPartido = [];
	$scope.elecciones = [];
	
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
	$scope.prevImgPartido = null;
	$scope.prevImgCandidato = null;
	$scope.eleccionesABorrar = EleccionFactory.getEleccionesABorrar();
	

	
	$scope.SinImagen = function (){
		if ($scope.prevImgPartido==""){
			$scope.vacio = true;
		}
		else {
			$scope.vacio = false;
		}
			return vacio;
	}
	
	$scope.hayFuentesDelSi = function (){
		
		var hayFuentes = false; 
		
		if($scope.noticiasDelSi.length<1){
			hayFuentes = false;
		}
		else{
			hayFuentes = true;
		}
	
		return hayFuentes;	
	}
	
	$scope.hayFuentesDelNo = function (){
		
		var hayFuentes = false; 
		
		if($scope.noticiasDelNo.length<1){
			hayFuentes = false;
		}
		else{
			hayFuentes = true;
		}
	
		return hayFuentes;	
	}
	
	
	
	$scope.hayFuentesCandidato = function (){
		
		var hayFuentes = false; 
		
		if($scope.noticiasCandidato.length<1){
			hayFuentes = false;
		}
		else{
			hayFuentes = true;
		}
	
		return hayFuentes;	
	}
	
	$scope.hayFuentesEleccion = function (){
		
		var hayFuentes = false; 
		
		if($scope.noticiasEleccion.length<1){
			hayFuentes = false;
		}
		else{
			hayFuentes = true;
		}
	
		return hayFuentes;	
	}
	
	
	$scope.getEleccionesActuales = function() {		
		EleccionFactory.getEleccionesActuales().then(
				function(response) {
					$scope.elecciones = response.data;
				},
				function(response){
					//error messagge
					console.log("Error en la obtencion de elecciones"+ response.data);
				}
		)
	}
	
	$scope.displayedCollection = [].concat($scope.eleccionesABorrar);
	$scope.removeEleccion = function removeEleccion(eleccion) {
        var index = $scope.eleccionesABorrar.indexOf(eleccion);
        if (index !== -1) {
            $scope.eleccionesABorrar.splice(index, 1);
        }
        
        EleccionFactory.borrarEleccion(eleccion.id)
        	.success(function(data){
        		console.log("Exito al borar la eleccion con id = "+eleccion.id);
        		console.log(data);
        	})
        	.error(function(){
        		console.log("Error al intentar borrar la eleccion... "+ data);
        	})
        
	}

	
	$scope.hayFuentes = function (){
		var hayFuentes = false; 
		
		if($scope.noticiasPartidos.length<1){
			hayFuentes = false;
		}
		else{
			hayFuentes = true;
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
			
			  switch ($scope.formData.tipoFuente) {
		       
			    case "facebook":
			    	$scope.esFacebook = true;
					break;
					
			    case "youtube":
			    	
			    	$scope.esYoutube = true;
			    	break;

			    case "twitter":
			    	$scope.esTwitter = true;
			    	break;
			    
				default:
				
					break;
		       }
			
			
			$scope.formData.FNPartido = "";
			$scope.formData.tipoFuente = "";
		
		
	}
	
	$scope.nuevaFuenteSimple = function (){
			
		var fuente = {
			tipo: $scope.formData.tipoFuenteCandidato,
			url:  $scope.formData.FNCandidato
		}
		
		console.log(fuente.url);
		
		if ($scope.formData.NombreCandidato=='Si'){
			$scope.noticiasDelSi.push(fuente);
			 switch ($scope.formData.tipoFuenteCandidato) {
		       
			    case "facebook":
			    	$scope.esFacebookCandi = true;
					break;
					
			    case "youtube":
			    	
			    	$scope.esYoutubeCandi = true;
			    	break;

			    case "twitter":
			    	
			    	$scope.esTwitterCandi = true;    	
			    	break;
			    
				default:
				
					break;
		       }
		}
		
		else if ($scope.formData.NombreCandidato=='No'){
			$scope.noticiasDelNo.push(fuente);
			 switch ($scope.formData.tipoFuenteCandidato) {
		       
			    case "facebook":
			    	$scope.esFacebookCandi = true;
					break;
					
			    case "youtube":
			    	
			    	$scope.esYoutubeCandi = true;
			    	break;

			    case "twitter":
			    	
			    	$scope.esTwitterCandi = true;    	
			    	break;
			    
				default:
				
					break;
		       }
			
		}
	      
		
		$scope.formData.FNCandidato = "";
		$scope.formData.tipoFuenteCandidato = "";
	
	
}
		
	
	$scope.nuevaFuenteCandidato =function (){
		
		var fuente = {
			tipo: $scope.formData.tipoFuenteCandidato,
			url:  $scope.formData.FNCandidato
		}
		$scope.noticiasCandidato.push(fuente);
		
		 switch ($scope.formData.tipoFuenteCandidato) {
	       
		    case "facebook":
		    	$scope.esFacebookCandi = true;
				break;
				
		    case "youtube":
		    	
		    	$scope.esYoutubeCandi = true;
		    	break;

		    case "twitter":
		    	
		    	$scope.esTwitterCandi = true;    	
		    	break;
		    
			default:
			
				break;
	       }
		$scope.formData.FNCandidato = "";
		$scope.formData.tipoFuenteCandidato = "";
	}
	
	$scope.nuevaFuenteEleccion = function (){
		
		var fuente = {
			tipo: $scope.formData.tipoFuenteEleccion,
			url:  $scope.formData.FNEleccion
		}
		$scope.noticiasEleccion.push(fuente);
		
		 switch ($scope.formData.tipoFuenteEleccion) {
	       
		    case "facebook":
		    	$scope.esFacebookElecc = true;
				break;
				
		    case "youtube":
		    	
		    	$scope.esYoutubeElecc = true;
		    	break;

		    case "twitter":
		    	
		    	$scope.esTwitterElecc = true;    	
		    	break;
		    
			default:
			
				break;
	       }
		$scope.formData.FNEleccion = "";
		$scope.formData.tipoFuenteEleccion = "";
	}
		
	
	$scope.mostrarListas = function(){
		return mostrarListas;
	}
	$scope.mostrarListasOtra = function(){
		return mostrarListasOtra;
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
				mostrarListasOtra = false;
				esOtra = true;
				$scope.numeroPaso3 = 3;
				$scope.numeroPaso4 = 4;
				$scope.numeroPaso5 = 5;
				$scope.siguientePaso1 = 2;
				$scope.mostrarTodasListas = false;
				break;
				
		    case "Departamental":
		    	$scope.primerCargo = "Intendente";
		    	$scope.esDepartamental = true; 
		    	deptosYnoticias = true;
		    	fuenteXPartido = false;
				esNacional = false;
				mostrarListas = true;
				mostrarListasOtra = false;
				esOtra = true;
				$scope.numeroPaso3 = 3;
				$scope.numeroPaso4 = 4;
				$scope.numeroPaso5 = 5;
				$scope.siguientePaso1 = 2;
				$scope.mostrarTodasListas = false;
				break;

		    case "Otra":
		    	$scope.primerCargo = "Presidente";
		    	$scope.segundoCargo = "Vicepresidente";
		    	$scope.esDepartamental = false; 
		    	esNacional = false;
		    	mostrarListas = false;
		    	mostrarListasOtra = true;
		    	esOtra = false;
		    	$scope.numeroPaso3 = 2;
		    	$scope.numeroPaso4 = 3;
		    	$scope.numeroPaso5 = 4;
		    	$scope.siguientePaso1 = 3;
		    	deptosYnoticias = false;
		    	$scope.mostrarTodasListas = true;
		    	break;
		    	
		    case "Simple":
		  
		    	$scope.esDepartamental = false; 
		    	esNacional = false;
		    	mostrarListas = false;
		    	mostrarListasOtra = false;
		    	esOtra = false;
		    	
		    	$scope.numeroPaso4 = 2;
		    	$scope.numeroPaso5 = 3;
		    	$scope.siguientePaso1 = 4;
		    	deptosYnoticias = false;
		    	$scope.mostrarTodasListas = true;
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
				$scope.mostrarTodasListas = false;
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
		
		if($scope.formData.tipoEleccion == 'Simple'){
			if($scope.formData.NombreCandidato == 'Si'){
				var candidato =	{
						 nombre: $scope.formData.NombreCandidato,
						 biografia: $scope.formData.BiografiaCandidato,
						 edad: $scope.formData.EdadCandidato,
						 dataFuenteDatos: $scope.noticiasDelSi,
						 dataListas: $scope.selection,
						 nombrePartido: '',
						 imagen : $scope.formData.imgCandidato,
						 cargo : 'UNKNOWN'
					}	
				
			}
			else if($scope.formData.NombreCandidato == 'No'){
				var candidato =	{
						 nombre: $scope.formData.NombreCandidato,
						 biografia: $scope.formData.BiografiaCandidato,
						 edad: $scope.formData.EdadCandidato,
						 dataFuenteDatos: $scope.noticiasDelNo,
						 dataListas: $scope.selection,
						 nombrePartido: '',
						 imagen : $scope.formData.imgCandidato,
						 cargo : 'UNKNOWN'
					}				
			}
		
			$scope.candidatos.push(candidato);
			
			//Limpiar para el siguiente candidato:
			formData.NombreCandidato = "";
			formData.FNCandidato = "";
			$scope.esFacebookCandi = false;
			$scope.esTwitterCandi = false;
			$scope.esYoutubeCandi = false;
			$scope.prevImgCandidato = null;
			$scope.$apply();
			
			
		}
		else {
		var candidato =	{
			 nombre: $scope.formData.NombreCandidato,
			 biografia: $scope.formData.BiografiaCandidato,
			 edad: $scope.formData.EdadCandidato,
			 dataFuenteDatos: $scope.noticiasCandidato,
			 dataListas: $scope.selection,
			 nombrePartido: '',
			 cargo : 'UNKNOWN',
			 imagen : $scope.formData.imgCandidato
		}					
		
		if($scope.formData.tipoEleccion == 'Otra'){
			candidato.dataListas = $scope.selectionParaOtro;
			candidato.cargo = formData.cargo.toUpperCase();
		}else{
			if(formData.tipoEleccion != 'Simple'){
				candidato.nombrePartido = formData.PartidoCandidato.nombre;
				candidato.cargo = formData.cargo.toUpperCase();
			}
				
		}
		
		$scope.candidatos.push(candidato);
		
		//Limpiar para el siguiente candidato:
		formData.NombreCandidato = "";
		formData.EdadCandidato = "";
		formData.BiografiaCandidato = "";
		$scope.selection = [];
		$scope.selectionParaOtro = [];
		formData.FNCandidato = "";
		formData.PartidoCandidato = "";
		$scope.noticiasCandidato = [];
		$scope.esFacebookCandi = false;
		$scope.esTwitterCandi = false;
		$scope.esYoutubeCandi = false;
		$scope.prevImgCandidato = null;
		$scope.$apply();
	
		}
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
	  	  
	  $scope.toggleSelectionOtro = function toggleSelectionOtro(lista) {
		    var idx = $scope.selectionParaOtro.indexOf(lista);

		    // is currently selected
		    if (idx > -1) {
		      $scope.selectionParaOtro.splice(idx, 1);
		    }

		    // is newly selected
		    else {
		      $scope.selectionParaOtro.push(lista);
		    }
		  };

	//Arreglo de Listas creadas en Wizard
	$scope.nuevaLista = function (formData){
		
		var lista =
			{
			 dataDepartamento: formData.DeptoLista,	
			 numero: $scope.formData.NumeroLista,
			 nombrePartido: ''
			}
		
		if(($scope.formData.tipoEleccion != 'Otra') && (formData.tipoEleccion != 'Simple')){
			lista.nombrePartido = formData.PartidoSeleccionado.nombre;
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
	         dataDeptos: $scope.selectedDeptos,
	         imagen : $scope.formData.imgPartido
        }
		$scope.partidos.push(partido);
		$scope.formData.NombrePartido="";
		$scope.formData.FechaPartido="";
		$scope.formData.Presidente="";
		$scope.formData.Descripcion="";
		$scope.formData.FNPartido="";
		$scope.esFacebook = false;
		$scope.esTwitter = false;
		$scope.esYoutube = false;
		//$scope.noticiasPartidosReal= null;
		$scope.prevImgPartido = null;
		$scope.$apply();
		$scope.noticiasPartidos = [];

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
	    	if(($scope.formData.Nombre==null)||($scope.formData.DescripcionEleccion==null)||($scope.formData.Fecha==null)||($scope.formData.tipoEleccion==null)){
	    		swal("Todos los campos son obligatorios!");
	    		$scope.step = 1;
	    	}
	    	else{
		    	if ($scope.formData.tipoEleccion == 'Otra'){
		    		$scope.setStep(3)
		    	}else
		    		if($scope.formData.tipoEleccion == 'Simple')
		    			$scope.setStep(4)

		    	$scope.activoPaso1 = false;
				$scope.activoPaso2 = true;
				$scope.activoPaso3 = false;
				$scope.activoPaso4 = false;
				$scope.activoPaso5 = false;
		    }
			break;
	    case 3:
	    	if(($scope.formData.Nombre==null)||($scope.formData.DescripcionEleccion==null)||($scope.formData.Fecha==null)||($scope.formData.tipoEleccion==null)||($scope.partidos.length==0
	    			&& $scope.formData.tipoEleccion=="Nacional") || ($scope.partidos.length==0 && $scope.formData.tipoEleccion=="Departamental")){
	    		swal("Todos los campos son obligatorios!");
	    		
	    		if ($scope.formData.tipoEleccion=="Otra"){
	    			$scope.step = 3;
	    		}
	    		else{
	    			$scope.step = 2;
	    		}
	    	}else{
	    		console.log("else del case 3")
	    		if($scope.formData.tipoEleccion == 'Simple')
	    			$scope.setStep(4)
	    		else{
	    			$scope.activoPaso1 = false;
	    			$scope.activoPaso2 = false;
	    			$scope.activoPaso3 = true;
	    			$scope.activoPaso4 = false;
	    			$scope.activoPaso5 = false;
	    		}
	    	}
	    	
			break;
	    case 4:
	    	if(($scope.formData.Nombre==null)||($scope.formData.DescripcionEleccion==null)||($scope.formData.Fecha==null)||($scope.formData.tipoEleccion==null)||($scope.partidos.length==0
	    			&& $scope.formData.tipoEleccion=="Nacional") || ($scope.partidos.length==0 && $scope.formData.tipoEleccion=="Departamental") || ($scope.listas.length==0 && $scope.formData.tipoEleccion!="Simple") ){
	    		swal("Todos los campos son obligatorios!");
	    		$scope.step = 3;
	    		if($scope.formData.tipoEleccion == 'Simple')
	    			$scope.step = 1;
	    	}
	    	$scope.activoPaso1 = false;
			$scope.activoPaso2 = false;
			$scope.activoPaso3 = false;
			$scope.activoPaso4 = true;
			$scope.activoPaso5 = false;
			break;
	    case 5:
	    	if(($scope.formData.Nombre==null)||($scope.formData.DescripcionEleccion==null)||($scope.formData.Fecha==null)||($scope.formData.tipoEleccion==null)||($scope.partidos.length==0
	    			&& $scope.formData.tipoEleccion=="Nacional") || ($scope.partidos.length==0 && $scope.formData.tipoEleccion=="Departamental") ||($scope.listas.length==0  && $scope.formData.tipoEleccion!="Simple")||($scope.candidatos.length==0)){
	    		swal("Todos los campos son obligatorios!");
	    		$scope.step = 4;
	    	}
	    
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
		$scope.formData.Fecha = new Date();
		$scope.formData.FechaPartido = new Date();
		
	
	//Se invoca desde el navbar para mostrar el Wizard
	$scope.crearEleccion = function(){		
		$scope.formData.PartidoSeleccionado = null;
		$scope.formData.Nombre= "";
		$scope.formData.DescripcionEleccion = "";
		$scope.formData.Fecha = "";
	}
	
	
	//Crea una nueva Eleccion
	$scope.altaEleccion = function(formData){
		
		var dataEleccion = {
				nombre: formData.Nombre,
				descripcion: formData.DescripcionEleccion,
				fecha: new Date(formData.Fecha),
				dataPartidos: $scope.partidos,
				dataListas: $scope.listas,
				dataCandidatos: $scope.candidatos,
				dataNoticias: $scope.noticiasEleccion,
				tipoEleccion: formData.tipoEleccion,
				logo : $scope.formData.logo,
				css : $scope.formData.css
		}
		
		EleccionFactory.crearEleccion(dataEleccion).then(
				function(response){
					swal("Eleccion creada!","","success");
					 console.log("TAMAÑO DE ALERTS"+$scope.alerts.length);	
					 $scope.closeAlert = function(index) {
							    $scope.alerts.splice(index, 1);
							  };
				},
				
				function(response){
					//error messagge
					sweetAlert("Oops...", "Error al crear la elección!", "error");
					console.log("TAMAÑO DE ALERTS"+$scope.alerts.length);	
					 $scope.closeAlert = function(index) {
							    $scope.alerts.splice(index, 1);
							  };
						
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
	  
	$scope.addLogo = function($files, $id){
		var idElement = $id;
		var $file = $files[0];
		  
		var logo = {
					name : $file.name,
					file : '',
					tipo : ''
		};
		var fileReader = new FileReader();
		
		fileReader.onload = function(event){
			var base64 = event.target.result;
			var regex = /^data:.+\/(.+);base64,(.*)$/;
		
			var matches = base64.match(regex);
			var ext = matches[1];
			var data = matches[2];
			logo.file = data;
			logo.tipo = ext;
			switch (idElement) {
			case 'logoEleccion':
				$scope.formData.logo = logo;
				$scope.prevImgEleccion = base64;
				break;
			case 'imgPartido':
				$scope.formData.imgPartido = logo;
				$scope.prevImgPartido = base64;
				break;
			case 'imgCandidato':
				$scope.formData.imgCandidato = logo;
				$scope.prevImgCandidato = base64;
				break;
			}
			$scope.$apply();
		}
	
		fileReader.readAsDataURL($file);
		
			
	}
	  
	  $scope.aceLoaded = function(_editor) {
		    // Options
			$scope.aceSession = _editor.getSession();
		    //_editor.setReadOnly(true);
			};
		  
		$scope.aceChanged = function(e) {
			//
			$scope.formData.css = $scope.aceSession.getDocument().getValue(); 
			$scope.aceDocumentValue = $scope.aceSession.getDocument().getValue();
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
.directive('droppable', function () {
	
	return {
		scope: {
			callback : '&'
		},
        link: function(scope, element) {
            // again we need the native object
            var el = element[0];
            
            el.addEventListener(
        	    'dragover',
        	    function(e) {
        	        e.dataTransfer.dropEffect = 'move';
        	        // allows us to drop
        	        if (e.preventDefault) e.preventDefault();
        	        this.classList.add('over-votapp');
        	        return false;
        	    },
        	    false
            );
            el.addEventListener(
        	    'dragenter',
        	    function(e) {
        	        this.classList.add('over-votapp');
        	        return false;
        	    },
        	    false
            );
            el.addEventListener(
        	    'dragleave',
        	    function(e) {
        	        this.classList.remove('over-votapp');
        	        return false;
        	    },
        	    false
            );
            function handleDrop(event) {
            	event.preventDefault();
    	        // Stops some browsers from redirecting.
    	        if (event.stopPropagation) event.stopPropagation();

    	        // {files : event.dataTransfer.files}
    	        scope.callback({files : event.dataTransfer.files,
    	        				id : el.id});
    	        return false;
             };
            el.addEventListener(
	    	    'drop',
	    	    handleDrop,
	    	    false
            );
        }
	};
})
.controller('ModalInstanceFuenteCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
	
	$scope.listaFuentes = [];
	
	$scope.esFacebook = false;
	$scope.esTwitter = false;
	$scope.esYoutube = false;

	
		
	$scope.crearFuenteDepto = function (){
		
		var DataFuenteDatos = {
			url: $scope.formData.FNDepto,	
			tipo: $scope.formData.tipoFuente	
		}		
		$scope.listaFuentes.push(DataFuenteDatos)	
		
			switch ($scope.formData.tipoFuente) {
	      
		    case "facebook":
		    	$scope.esFacebook = true;
		    	break;
				
		    case "youtube":
		    	$scope.esYoutube = true;
		    	break;

		    case "twitter":
		    	$scope.esTwitter = true;
		    	break;
		    
			default:
			
				break;
	       }
		
		$scope.formData.FNDepto = "";
		$scope.formData.tipoFuente = "";
		
	
	}	
	
	$scope.finCrearFuentes = function () {
		$modalInstance.close($scope.listaFuentes);
	};
	
	$scope.hayFuentes = function (){
		var hayFuentes = false; 
		
		if($scope.listaFuentes.length<1){
			hayFuentes = false;
		}
		else{
			hayFuentes = true;
		}
	
		return hayFuentes;
	}
	

	
}])















