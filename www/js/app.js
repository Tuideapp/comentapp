var app = angular.module('principal', [
  'ionic',
  'ngCordova', 
  'controlador',
  'directivas',
  'servicios'
]);

app.run(function(
  $ionicPlatform, 
  $cordovaBarcodeScanner, 
  $rootScope, 
  $cordovaVibration,
  $window
){
  
  $ionicPlatform.ready(function() {    
    
    $rootScope.$apply(function(){ $rootScope.fondoprincipal = true; }); 


    console.log($window.sessionStorage.getItem("userInfo").email);
      //preguntar si la en la localstore hay información 
      //sino hay entonces mostrar el login 
      //si hay verificar si la fecha va a caducar
        //si la fecha caducó entonces mostrar el login
        //si la fecha no caducó entohnces permitir el ingreso
    
  });
});


app.config(function($stateProvider, $urlRouterProvider) {   

  $urlRouterProvider.otherwise('/')
  $stateProvider.state('ressetpassword', {
    cache: false,
    url: '/ressetpassword',
    templateUrl: 'vistas/ressetpassword.html'
  }) 
  
  $stateProvider.state('slide', {
    cache: false,
    url: '/',
    templateUrl: 'vistas/slide.html'
  }) 

  $stateProvider.state('ppal', {
    cache: false,
    url: '/ppal',
    templateUrl: 'vistas/principal.html'
  }) 

  $stateProvider.state('redimirpuntos', {
    cache: false,
    url: '/redimirpuntos',
    templateUrl: 'vistas/redimirpuntos.html'
  })
 
   $stateProvider.state('agradecimientos', {
    cache: false,
    url: '/agradecimientos?nombreCausa',
    templateUrl: 'vistas/agradecimientos.html'
  })
  
  $stateProvider.state('listadorempresa', {
    cache: false,
    url: '/listadorempresa?empresa',
    templateUrl: 'vistas/listadorempresa.html'
  })
 
   $stateProvider.state('calificarempresas', {
    cache: false,
    url: '/calificarempresas?empresa',
    templateUrl: 'vistas/calificarempresas.html'
  })
 

   $stateProvider.state('calificadordetalleempresa', {
    cache: false,
    url: '/calificadordetalleempresa?idEmpresa?nombreEmpresa?categoriaEmpresa',
    templateUrl: 'vistas/calificadordetalleempresa.html'
  })



})
