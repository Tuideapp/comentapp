/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//// MÓDULO DE CONTROLADOR
//// 25 DE ENERO DE 2016
//// JUAN DAVID VANEGAS ROMERO
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
var app = angular.module('controlador', ['ionic']);


/////////////////////////////////////////////////////////////
// CONTROLADOR PRINCIPAL
/////////////////////////////////////////////////////////////
app.controller('principal',function(
  $scope,  
  $ionicSideMenuDelegate,
  $cordovaGeolocation,
  $cordovaCapture,
  $cordovaBarcodeScanner,
  $cordovaMedia,
  $ionicLoading,
  $cordovaVibration,
  $ionicPopup,
  $state,
  Servicios,
  $rootScope
  ){ 

  $scope.Limpiar = function(){
    $scope.NombreEmpresa = "";
    alert("as")
  }

  

  /////////////////////////////////////////////////////////////
  // ESCANEAR CÓDIGO QR
  /////////////////////////////////////////////////////////////
  $scope.EscanearQr =  function(){

    $cordovaBarcodeScanner.scan().then(function(ImgScaneada){
      $cordovaVibration.vibrate(600);
      Servicios.BuscarEmpresa(ImgScaneada.text);
    },function(error){

      $ionicPopup.alert({
        title: 'Error al escanear el Código QR!',
        cssClass: 'text-center',
        template: 'Hubo un error al escanear el Código QR de esta empresa, favor vuelva a intentarlo.<br><br><b>Error técnico:</b><br>'+error,
        okText: 'Cerrar',
        okType: 'button-assertive'
      });

    });

  }

  /////////////////////////////////////////////////////////////
  //  LIMPIA EL CONTROL DE NOMBRE DE EMPRESA
  /////////////////////////////////////////////////////////////
  $scope.LimpiarNombreEmpresa = function(){  
    $scope.NombreEmpresa = "";
  }


  /////////////////////////////////////////////////////////////
  //  CALCULO LOS PUNTOS QUE TIENE EL USUARIO LOGEADO
  /////////////////////////////////////////////////////////////  
  Servicios.MisPuntos();  


  /////////////////////////////////////////////////////////////
  // DEZPLEGAR IZQUIERDA MENÚ
  /////////////////////////////////////////////////////////////
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }; 

});




app.controller('calificadordetalleempresa', function(
  $scope,
  $state,
  Servicios,
  $stateParams,
  $cordovaGeolocation,
  $ionicPopup,
  $ionicSideMenuDelegate
  ){

  var idEmpresa = $stateParams.idEmpresa;
  $scope.empresa = $stateParams.nombreEmpresa;
  $scope.categoria = $stateParams.categoriaEmpresa;


  var gps = [];
  var foto = [];


  /////////////////////////////////////////////////////////////
  // GUARDAR COMENTARIO
  /////////////////////////////////////////////////////////////
  $scope.GuardarComentario = function(calificacion, comentario){

    if (comentario == undefined) { comentario = ""};

    if (comentario == "" || calificacion == undefined) {

      $ionicPopup.alert({
        title:'Validación De Datos',
        cssClass:'text-center',
        template:'Debe seleccionar una calificación y agregrar minimo un comentario',
        okText: 'Cerrar',
        okType: 'button-assertive'
      });

    }else{

      var objGPS;
      if (gps.length == 0) {
        objGPS = new CB.CloudGeoPoint(0,0);
      }else{
        objGPS = new CB.CloudGeoPoint(gps[0],gps[1]);
      };

    //var fileUploadControl = $("#profilePhotoFileUpload")[0];
    //if (fileUploadControl.files.length > 0) {
      //var file = fileUploadControl.files[0];
      //var name = "photo.jpg";

      

     /* var cloudFile = new CB.CloudFile(new file(foto));
//      cloudFile.set('name',foto.name);
      cloudFile.save({
        success : function(cloudFile){
          alert(cloudFile+" exito"); */

          
  //  CB.CloudApp.init("nhdjpkgltbub","d713c96b-f8c5-40e5-a0df-90a7a8761cba");

  


  var cm = new CB.CloudObject('Comentarios'); 
  cm.set("IdPersona",new CB.CloudObject("User", "W3ArVG8G"));
  cm.set("IdEmpresa", new CB.CloudObject("User", idEmpresa));
  cm.set("Comentario", comentario);
  cm.set("Calificacion", parseInt(calificacion));
  cm.set("Ubicacion", objGPS);
  cm.save().then(function(){ 

    var usuario = new CB.CloudQuery('User');
    usuario.findById("W3ArVG8G", {
      success: function(objUsuario){

        objUsuario.set("Puntos", objUsuario.get("Puntos") + 5);
        objUsuario.save({
          success: function(){ 

            $ionicPopup.confirm({
              title: 'Comentario enviado con éxito!',
              cssClass: 'text-center',
              template: 'En Comentapp ayudar a otros es GRATIS!<br><br>Haz ganado 5 puntos.',
              okText: 'Redimir',
              okType: 'button-positive',
              cancelText: 'No Redimir',
              cancelType: 'button-light'
            }).then(function(Accion){              
              if(Accion){
                $state.go("redimirpuntos");
              }else{
                $state.go("ppal");
              }
            }); 
          },error: function(error){

            $ionicPopup.alert({
              title: 'Error entregando los 5 puntos al usuario.',
              cssClass: 'text-center',
              template: "Ha ocurrido un error al entregarle los 5 puntos al usuario luego de comentar.<br> <br> <b>Error:</b><br>"+error,
              okText: 'Cerrar',
              okType: 'button-assertive'
            }); 
          }
        }); 
},error: function(error){ 

  $ionicPopup.alert({
    title: 'Error buscando al usuario.',
    cssClass: 'text-center',
    template: "Ha ocurrido un error al buscar el usuario.",
    okText: 'Cerrar',
    okType: 'button-assertive'
  });
} 
}); 
}, function(error){

  $ionicPopup.confirm({
    title: 'Error guardando su comentario!',
    cssClass: 'text-center',
    template: 'Hubo un error guardando su comentario, favor comuniquese con soporte técnico.<br><br><b>Error:</b> <br>'+error,
    okText: 'Soporte técnico',
    okType: 'button-positive',
    cancelText: 'Cerrar',
    cancelType: 'button-light'
  }).then(function(){$state.go("ppal");});
}); 

/*


        }, error: function(error){
          alert("Error al guardar la img: "+error);
        }
      });
//}*/



}
}

    /////////////////////////////////////////////////////////////
  // DEZPLEGAR IZQUIERDA MENÚ
  /////////////////////////////////////////////////////////////
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }; 



  $scope.gpsControlText = "Cargar ubicación";

  /////////////////////////////////////////////////////////////
  // ACTIVAR GPS
  /////////////////////////////////////////////////////////////
  $scope.ActivarGPS = function(){


    //cambiar el estado del GPS
    if (gps[0] == undefined || gps[0] == "") {

      $scope.gpsControlText = "Ubicación cargada";
      $cordovaGeolocation
      .getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
      .then(function (position) { 

        gps[0] = position.coords.latitude;
        gps[1] = position.coords.longitude;
      }, function(err) {
        alert("Error ubicando su posición: "+err.message);
      });

    }else{
      $scope.gpsControlText = "Enviar ubicación";
      gps[0] = 0;
      gps[1] = 0;
    };



  }
  
  /////////////////////////////////////////////////////////////
  // ADJUNTAR FOTO
  /////////////////////////////////////////////////////////////
  /*$scope.AdjuntarFoto = function(){

      $cordovaCapture.captureImage({ limit: 1 }).then(function(imageData) {
        $scope.urlfoto = imageData[0].fullPath;
        foto = imageData[0];

      }, function(err) {
        alert("Error capturando la fotografía: "+err.message);
      });
} */


});





/////////////////////////////////////////////////////////////
// CONTROLADOR LISTADOR EMPRESA
/////////////////////////////////////////////////////////////
app.controller('listadorempresa',function(
  $scope,
  $state,
  Servicios,
  $stateParams,
  $cordovaGeolocation,
  $ionicPopup,
  $ionicSideMenuDelegate
  ){  

    /////////////////////////////////////////////////////////////
  // DEZPLEGAR IZQUIERDA MENÚ
  /////////////////////////////////////////////////////////////
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }; 

  $scope.CalificadorDetalleEmpresa = function(idEmpresa,nombreEmpresa, categoriaEmpresa){

    $state.go("calificadordetalleempresa",{idEmpresa:idEmpresa, nombreEmpresa:nombreEmpresa,categoriaEmpresa:categoriaEmpresa});
  }

  //Cargar las empresas    
  CB.CloudApp.init("nhdjpkgltbub","d713c96b-f8c5-40e5-a0df-90a7a8761cba"); 
  new CB.CloudQuery('User')
  .startsWith("username",$stateParams.empresa)
  //.equalTo("CategoriaEmpresa",new CB.CloudObject("CategoriaEmpresa","QpYXrcQx"))
  .find().then(function(data){ 


    var Cat = new CB.CloudQuery('CategoriaEmpresa');
    Cat.findById(data[0].get("CategoriaEmpresa").id,
    {
      success: function(data1){

        $scope.fondoprincipal = false; 
        $scope.Empresas = [];

        if (data.length > 0) { 

          data.forEach(function(v,k){ 
            $scope.$apply(function(){ 
              $scope.Empresas.push({
                id:v.id,
                Nombre:v.get("username"),
                Descripcion:v.get("Descripcion"),
                Categoria:data1.get("Nombre")
              })
            }) 
          }) 
        }  
      },error: function(error){
        alert(error);
      }
    });


  }, function(error){
    alert("Error Al Cargar las Empresas \n"+error);
  }); 






});



/////////////////////////////////////////////////////////////
// CONTROLADOR PARA CALIFICAR EMPRESAS Y LISTAR EMPRESAS
/////////////////////////////////////////////////////////////
app.controller('calificarempresas',function(
  $scope,
  $ionicPopup,
  $ionicSideMenuDelegate,
  $state,
  Servicios,
  $ionicSideMenuDelegate
  ){

  Servicios.BuscarEmpresasPantallaCalificarEmpresa();

  $scope.CalificadorDetalleEmpresa = function(idEmpresa,nombreEmpresa, categoriaEmpresa){

    $state.go("calificadordetalleempresa",{idEmpresa:idEmpresa, nombreEmpresa:nombreEmpresa,categoriaEmpresa:categoriaEmpresa});
  }


  /////////////////////////////////////////////////////////////
  // DEZPLEGAR IZQUIERDA MENÚ
  /////////////////////////////////////////////////////////////
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }; 


});



/////////////////////////////////////////////////////////////
// CONTROLADOR REDIMIR PUNTOS DE USUARIO
/////////////////////////////////////////////////////////////
app.controller('redimirpuntos',function(
  $scope,
  $ionicPopup,
  $ionicSideMenuDelegate,
  $state,
  Servicios
  ){

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }; 

  /////////////////////////////////////////////////////////////
  //  CALCULO LOS PUNTOS QUE TIENE EL USUARIO LOGEADO
  ///////////////////////////////////////////////////////////// 
  Servicios.MisPuntos(); 

  /////////////////////////////////////////////////////////////
  //  REDIMIDE LOS PUNTOS QUE TIENE EL USUARIO ALMACENADOS
  ///////////////////////////////////////////////////////////// 
  $scope.RedimirPuntos = function(IdCausa){

    CB.CloudApp.init("nhdjpkgltbub","d713c96b-f8c5-40e5-a0df-90a7a8761cba");
    var ca = new CB.CloudQuery('Causas');
    ca.findById(IdCausa,{
      success: function(objCausa){ 

        var r =  new CB.CloudQuery('Redencion');
        r.equalTo("IdCausa",  objCausa);
        r.find().then(function(objPuntosCausa){ 

          var acumulado = 0;
          objPuntosCausa.forEach(function(v,k){
            acumulado = acumulado + v.get("Puntos");
          //  console.log(v.get("Puntos")+" posicion: "+k+" --")
        });
          


          if (acumulado < objCausa.get("Puntos")) {

            var cantidadnecesaria;
            if (acumulado == 0) {
              cantidadnecesaria = objCausa.get("Puntos");
            }else{
              cantidadnecesaria = objCausa.get("Puntos") - acumulado;
            };
            

            var usuario =  new CB.CloudQuery('User');
            usuario.equalTo("username","Juan David Vanegas Romero");
            usuario.selectColumn(["Puntos"]);
            usuario.findOne().then(function(datos){ 

              var devuelta;
              var puntosaportados;

              if (datos.get("Puntos") >= cantidadnecesaria) {
                devuelta = datos.get("Puntos") - cantidadnecesaria;
                puntosaportados = cantidadnecesaria;

                  //cambiamos el estado de la causa cuando esta full
                  objCausa.set("Estado", 1);
                  objCausa.save();

                }else{
                  puntosaportados = datos.get("Puntos");
                  devuelta = 0;
                };

                //entregamos la devuelta al usuario 
                datos.set("Puntos",devuelta);
                datos.save(); 

                //inserte
                Servicios.InsertarRedencion("4bD5Gz7Q", objCausa.id, puntosaportados)

              }); 
          }else{



            $ionicPopup.alert({
              title:'Causa completa!',
              cssClass:'text-center',
              template:'Gracias a nuestros usuarios de la red Comentapp esta causa esta 100% cubierta.<br><br> <b> Te invitamos a que inviertas tus puntos en otra causa mas.</b>',
              okText: 'Invertir En Otra Causa',
              okType: 'button-positive'
            });
          };              
        }); 

}, error: function(error){

  $ionicPopup.alert({
    title: 'Error de consulta de puntos',
    cssClass: 'text-center',
    template: 'Hubo un error al consultar los puntos base de esta causa<br><br>Error técnico:<br>'+error,
    okText: 'Tomar Pantallazo!',
    okType: 'button-positive'
  }).then(function(){

          //Código para tomar pantallazo

        });
}

});


}


  /////////////////////////////////////////////////////////////
  // CONSULTA LAS CAUSAS QUE TIENE EL SISTEMA
  ///////////////////////////////////////////////////////////// 
  CB.CloudApp.init("nhdjpkgltbub","d713c96b-f8c5-40e5-a0df-90a7a8761cba"); 

    //Cargar las empresas
    var orden = new CB.CloudQuery('Causas')
    orden.equalTo("Estado", 0);      
    orden.find().then(function(data){ 

      if (data){  

        $scope.Causas = [];
        data.forEach(function(v,k){

          var cat = new CB.CloudQuery('CategoriasCausas')      
          cat.findById(v.get("Categoria").id).then(function(data1){ 


            var use = new CB.CloudQuery('User')   
            use.findById(v.get("IdEmpresa").id).then(function(data2){ 

             $scope.$apply(function(){

              $scope.Causas.push({
                Id:v.id,
                Descripcion:v.get("Descripcion"),
                Categoria:data1.get("Nombre"),
                Puntos:v.get("Puntos"),
                Empresa:data2.get("username")
              });
            }); 




           });



          });  
        });



      }else{

        $ionicPopup.alert({
          title: 'No hay datos.',

          cssClass: 'text-center',
          template: 'Ahora no contamos con datos en el sistema.',
          okText: 'Cerrar',
          okType: 'button-assertive'
        }); 
      };  
    }, function(error){
      alert("Error Al Cargar las Empresas \n"+error.message);
    });  



});




/////////////////////////////////////////////////////////////
// CONTROLADOR AGRADECIMIENTOS
/////////////////////////////////////////////////////////////
app.controller('agradecimientos',function(
  $scope,
  $ionicPopup,
  $ionicSideMenuDelegate,
  $cordovaBarcodeScanner,
  $cordovaVibration,
  $stateParams
  ){

  $scope.Empresa = "Corona";
  $scope.nombreCausa = $stateParams.nombreCausa;


    /////////////////////////////////////////////////////////////
  // DEZPLEGAR IZQUIERDA MENÚ
  /////////////////////////////////////////////////////////////
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  }; 




 /////////////////////////////////////////////////////////////
  // ESCANEAR CÓDIGO QR
  /////////////////////////////////////////////////////////////
  $scope.EscanearQr =  function(){

    $cordovaBarcodeScanner.scan().then(function(ImgScaneada){
      $cordovaVibration.vibrate(600);
      Servicios.BuscarEmpresa(ImgScaneada.text);
    },function(error){

      $ionicPopup.alert({
        title: 'Error al escanear el Código QR!',
        cssClass: 'text-center',
        template: 'Hubo un error al escanear el Código QR de esta empresa, favor vuelva a intentarlo.<br><br><b>Error técnico:</b><br>'+error,
        okText: 'Cerrar',
        okType: 'button-assertive'
      });

    });

  }




});



/////////////////////////////////////////////////////////////
//CONTROLADOR LOGIN
/////////////////////////////////////////////////////////////
app.controller('login',function(
  $scope, 
  $ionicSlideBoxDelegate
  ){
 
  $scope.slideEmail = function() {
    $ionicSlideBoxDelegate.next();
  }

  $scope.slideSingup = function() { 
    $ionicSlideBoxDelegate.slide(2, 300);
  }


});

/////////////////////////////////////////////////////////////
//CONTROLADOR EMAIL
/////////////////////////////////////////////////////////////
app.controller('loginmail',function(
  $scope, 
  $ionicSlideBoxDelegate,
  $state
  ){
 
  $scope.slideSingup = function() {
    $ionicSlideBoxDelegate.next();
  }

 

});

/////////////////////////////////////////////////////////////
//CONTROLADOR SIGNUP
/////////////////////////////////////////////////////////////
app.controller('singup',function(
  $scope, 
  $ionicSlideBoxDelegate, 
  $state,
  $q,
  UserService,
  $ionicLoading,
  $ionicPopup,
  $ionicSlideBoxDelegate,
  $window
  ){

  var idUsuarioFacebook;
  $scope.registrarseConFacebook = function(){
    conectarseConFacebook();
  } 

  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;
    getFacebookProfileInfo(authResponse).then(function(profileInfo){  

      idUsuarioFacebook = profileInfo.id;
      $scope.nombreUsuario = profileInfo.name;       
      $scope.correoUsuario = profileInfo.email; 
      $scope.fotoUsuario = "http://graph.facebook.com/" + idUsuarioFacebook + "/picture?type=large";

      facebookConnectPlugin.logout(function(){
        $ionicLoading.hide();
        $state.go('app.home');
      },
      function(fail){
        $ionicLoading.hide();
      });      
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
        console.log(response);
        info.resolve(response);
      },
      function (response) {
        console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  function conectarseConFacebook(){
    
    facebookConnectPlugin.getLoginStatus(function(success){ 
      $ionicLoading.show({template: 'Entrando a Facebook...'});
      facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError); 
    });
  }

  $scope.crearCuenta = function(nombreUsuario, correoUsuario, contrasena){ 
    
    if (nombreUsuario == undefined ||  correoUsuario == undefined || contrasena == undefined) {

      $ionicPopup.alert({
        title: 'Validación de datos',
        cssClass: 'text-center',
        template: 'Verifique si el correo electrónico esta bien escrito o si los demas campos estan vacios.',
        okText: 'Continuar',
        okType: 'button-assertive'
      });

    }else{

      //varlidar que no exista el usuario
      CB.CloudApp.init("nhdjpkgltbub","d713c96b-f8c5-40e5-a0df-90a7a8761cba");
      new CB.CloudQuery('User').equalTo("email",correoUsuario).findOne().then(function(data){
        
        if (data) {

          $ionicPopup.alert({
            title: 'Registro de usuario',
            cssClass: 'text-center',
            template: "Encontramos que usted ya se encuentra registrado en nuestra plataforma, favor autenticarse.",
            okText: 'Autenticarme',
            okType: 'button-assertive'
          }).then(function(){
              $ionicSlideBoxDelegate.slide(0, 300);
          });

        }else{

          if (idUsuarioFacebook == undefined) {idUsuarioFacebook = "0"}; 

          var nuevoUsuario = new CB.CloudUser('User');
          nuevoUsuario.set("idFacebook",idUsuarioFacebook);
          nuevoUsuario.set("username",nombreUsuario);
          nuevoUsuario.set("email",correoUsuario);
          nuevoUsuario.set("password",contrasena);  
          nuevoUsuario.signUp({
            success: function(user)  {

             
              user.addToRole(new CB.CloudRole("Cliente"), {
                success: function(user){ 

                  $window.sessionStorage.setItem = ("userInfo",{idfacebook:user.get("idFacebook"), email:user.get("email")}); 
                  $state.go("ppal");

                },error: function(error){

                     $ionicPopup.alert({
                      title: 'Registro de usuario',
                      cssClass: 'text-center',
                      template: 'Hubo un error asociando el rol al usuario.<br><br>Error: '+error,
                      okText: 'Continuar',
                      okType: 'button-assertive'
                    }).then(function(){
                       $ionicSlideBoxDelegate.slide(0, 300);
                    });
                  }  
              });  

          },error: function(err){
             $ionicPopup.alert({
                title: 'Registro de usuario',
                cssClass: 'text-center',
                template: 'Hubo un error registrando el usuario, vuelva a intentarlo nuevamente.<br><br>Error: '+err,
                okText: 'Continuar',
                okType: 'button-assertive'
              });
            }
          });


          

        }; 

    });
  }
}

});