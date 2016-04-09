/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
////
//// MÓDULO DE DIRECTIVAS
//// 25 DE ENERO DE 2016
//// JUAN DAVID VANEGAS ROMERO
////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
var app = angular.module('directivas', ['ionic','servicios']);

/////////////////////////////////////////////////////////////
// DIRECTIVA ENTER
//
// Busca por texto ingresado las empresas inscritas en el 
// sistema
/////////////////////////////////////////////////////////////
app.directive('ngEnter',  function(Servicios, $state, $ionicPopup, $rootScope) {
        
        return function(scope, element, attrs) {

            element.bind("keypress", function(event) {

                if(event.which === 13) {

                        scope.$apply(function(){
                            scope.$eval(attrs.ngEnter);
                        });
                        
                        event.preventDefault();
                            
                        if (attrs.ngEnter == "") {

                            $ionicPopup.alert({
                                title: 'Campo Nombre De Empresa Vacío',
                                cssClass: 'text-center',
                                template: 'Ingresa el nombre de la empresa correctamente.',
                                okText: 'Cerrar',
                                okType: 'button-assertive'
                            });

                            $rootScope.fondoprincipal = true;   
                            $state.go("ppal");
                        }else{
                            Servicios.BuscarEmpresa(attrs.ngEnter);
                        };
                        

                        
                }


            });
        };
} );