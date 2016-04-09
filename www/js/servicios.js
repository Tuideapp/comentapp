/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
////
//// MÓDULO DE SERVICIOS
//// 25 DE ENERO DE 2016
//// JUAN DAVID VANEGAS ROMERO
////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
var app = angular.module('servicios', ['ionic']);

/////////////////////////////////////////////////////////////
// DIRECTIVA ENTER
//
// Busca por texto ingresado las empresas inscritas en el 
// sistema
/////////////////////////////////////////////////////////////

app.service("Servicios", function($rootScope, $ionicPopup, $state){
	var yo = this;

	yo.InsertarRedencion = function(idusuario, idcausa, puntos){

		var Redencion = new CB.CloudObject('Redencion'); 
        Redencion.set("IdPersona", new CB.CloudObject("User", idusuario));
        Redencion.set("IdCausa", new CB.CloudObject("Causas", idcausa));
        Redencion.set("Puntos", puntos);
        Redencion.save({
          success: function(data){

          	var causa = new CB.CloudQuery('Causas'); 
          	causa.findById(idcausa).then(function(data1){

          		if(data1){
		          	$state.go("agradecimientos",{nombreCausa:data1.get("Nombre")});
		        };
          	});
        	}
    	}); 
	}

	yo.MisPuntos = function(){		

		CB.CloudApp.init("nhdjpkgltbub","d713c96b-f8c5-40e5-a0df-90a7a8761cba"); 
		new CB.CloudQuery('User')
		.findById("W3ArVG8G",{
			success: function(data){

				$rootScope.$apply(function(){
					$rootScope.PuntosUsuario = data.get("Puntos");
				});
				
			},
			error: function(error){
				alert("Mis puntos: "+error)
			}
		});
	}


	yo.BuscarEmpresasPantallaCalificarEmpresa = function(){
	 	
 		CB.CloudApp.init("nhdjpkgltbub","d713c96b-f8c5-40e5-a0df-90a7a8761cba"); 
		new CB.CloudQuery('User')
		.equalTo("roles",new CB.CloudObject("roles","CQOQBjdj"))
		.find({
			success: function(Empresas){ 
				$rootScope.Empresas = [];  
				Empresas.forEach(function(v,k){ 

						var Cat = new CB.CloudQuery('CategoriaEmpresa');
				      	Cat.findById(v.get("CategoriaEmpresa").id,
				        {
				          success: function(data1){
				          
			                $rootScope.$apply(function(){ 
			                    $rootScope.Empresas.push({
			                        id:v.id,
			                        Nombre:v.get("username"),
			                        Descripcion:v.get("Descripcion"),
			                        Categoria:data1.get("Nombre")
			                    })
			                }) 
				           
				        
				      },error: function(error){
				        alert(error);
				      }
				    });



				});

	  				


			

			},error: function(error){

				$ionicPopup.alert({
					title: 'Error al consultar los datos.',
					cssClass: 'text-center',
					template: 'Hubo un error al consultar los datos de la empresa ingresada.',
					okText: 'Cerrar',
					okType: 'button-assertive'
				});
			}
		}); 
	}

	yo.BuscarEmpresa = function(empresa){
		//$rootScope.contenedordeempresas = true;

		//if(empresa == null){

			//$rootScope.fondoprincipal = true; 
			//$rootScope.Empresas = [];
		//}else{		

			//Cargar las empresas    
			CB.CloudApp.init("nhdjpkgltbub","d713c96b-f8c5-40e5-a0df-90a7a8761cba"); 
			new CB.CloudQuery('User')
			.startsWith("username",empresa)
			.find({
				success: function(d){
					
					if (d.length != 0) {
						$state.go("listadorempresa",{empresa:empresa.toLowerCase()});
					}else{

						$ionicPopup.alert({
							title: 'Resultado De La Consulta',
							cssClass: 'text-center',
							template: 'No se encontrarón empresas con el nombre ingresado!',
							okText: 'Cerrar',
							okType: 'button-assertive'
						}).then(function(){
							
							 					$rootScope.fondoprincipal = true;	
							$state.go("ppal");
							
						});
						
					}

				},error: function(error){

					$ionicPopup.alert({
						title: 'Error al consultar los datos.',
						cssClass: 'text-center',
						template: 'Hubo un error al consultar los datos de la empresa ingresada.',
						okText: 'Cerrar',
						okType: 'button-assertive'
					});
				}
			});

					
					 	
		           
	//};
	}

});


app.service('UserService', function() {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
});