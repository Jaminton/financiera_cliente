'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoAddOrdenPagoProveedorCtrl
 * @description
 * # OrdenPagoAddOrdenPagoProveedorCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('AddOrdenPagoProveedorCtrl', function ($scope, financieraRequest, administrativaRequest, $http) {
    $scope.ordenPago = {};
    $scope.consultaOrdenPago = {};
    $scope.visible_campo_convenio = false;

    // get data
    financieraRequest.get("unidad_ejecutora", "")
      .then(function(response){
        $scope.unidad_ejecutora = response.data;
      });
    administrativaRequest.get("convenio", "")  //pending: por definir si vieene del rp
      .then(function(response){
        $scope.convenio = response.data;
      });
    financieraRequest.get("tipo_orden_pago", "query=EstadoActivo%3Atrue")
      .then(function(response){
        $scope.tipo_orden_pago = response.data;
      });

    //Operaciones que disparan los select
    $scope.convenio_select = function(Id){ //pending: por definir si vieene del rp
      $scope.consultaOrdenPago.ConvenioDescripcion = null;
      administrativaRequest.get("convenio", "query=Id%3A" + Id)
      .then(function(response){
        if(response.data){
          $scope.ordenPago.Convenio = {'Id': parseInt(Id)};
          $scope.consultaOrdenPago.ConvenioDescripcion = response.data[0]['NOMBRE'];
        }
      });
    }
    $scope.unidad_ejecutora_select = function(unidad_ejecutora){
      if(unidad_ejecutora){
        //$scope.ordenPago.UnidadEjecutora = {'Id': unidad_ejecutora.Id}
        if(unidad_ejecutora.Id == 2){
          $scope.visible_campo_convenio = true;
        }else{
          $scope.visible_campo_convenio = false;
        }
      }
    }
    $scope.tercero_por_tipo_persona = function(tipo_persona){
      if(tipo_persona){
        administrativaRequest.get("informacion_proveedor", "query=Tipopersona%3A" + tipo_persona)
          .then(function(response){
            $scope.tercero = response.data;
          });
      }
    }
    $scope.tercero_by_cc_select = function(num_cedula){
      if(num_cedula){
        administrativaRequest.get("informacion_proveedor", "query=NumDocumento%3A" + num_cedula)
          .then(function(response){
            if(response.data){
              $scope.consultaOrdenPago.TerceroNombre = response.data[0]['NomProveedor'];
              $scope.consultaOrdenPago.TerceroDireccion = response.data[0]['Direccion'];
              $scope.consultaOrdenPago.TerceroTelefono = response.data[0]['TelAsesor'];
              $scope.consultaOrdenPago.TerceroNumeroCuenta = response.data[0]['NumCuentaBancaria'];
              $scope.consultaOrdenPago.TerceroBanco = response.data[0]['IdEntidadBancaria']['NombreBanco'];
              $scope.consultaOrdenPago.TerceroTipoCuenta = response.data[0]['TipoCuentaBancaria'];

              $scope.rp_by_tercero(num_cedula);
            }
          });
      }
    };
    //
    $scope.rp_by_tercero = function(num_cedula){
      administrativaRequest.get("registo_presupuestal", "query=Beneficiario%3A" + num_cedula)
        .then(function(response){
          if(response.data){
            $scope.rp_by_tercero = response.data;
          }
        });
    }
    $scope.get_data_rp_select = function(numero_rp){
      $scope.ordenPago.RegistroPresupuestal = numero_rp.Id;

      $scope.consultaOrdenPago.RP_valor = numero_rp.Valor;
      $scope.consultaOrdenPago.RubroCodigo = numero_rp.Rubro.Codigo;
      $scope.consultaOrdenPago.RubroDescripcion = numero_rp.Rubro.Descripcion;
      $scope.consultaOrdenPago.DisponibilidadNumeroDisponibilidad = numero_rp.Disponibilidad.NumeroDisponibilidad;
      $scope.consultaOrdenPago.DisponibilidadObjeto = numero_rp.Disponibilidad.Objeto;
      $scope.consultaOrdenPago.VigenciaPresupuestal = numero_rp.Vigencia;
    }
    $scope.get_valor_bruto  = function (valor_base, iva){
      if(valor_base == null || valor_base == 0){
        $scope.ValorIva = 0;
        $scope.ValorBruto =0;
      }else if(iva == null || iva == 0) {
        $scope.ValorIva = 0;
        $scope.ValorBruto =0;
      }else{
        $scope.Iva = parseInt(iva);
        $scope.ordenPago.ValorTotal = parseInt(valor_base);
        $scope.ValorIva = ( parseInt(valor_base) * ( parseInt(iva)/100) );
        $scope.ValorBruto = parseInt(valor_base) + parseInt($scope.ValorIva);
      }
    }
    // Insert Orden Pago
    $scope.addOpProveedor = function(){

      console.log("hola")
      $scope.ordenPago.Vigencia = new Date().getFullYear();
      //$scope.ordenPago.RegistroPresupuestal = 1;
      //$scope.ordenPago.ValorTotal = 10000;
      $scope.ordenPago.PersonaElaboro = 1;
      //$scope.ordenPago.TipoOrdenPago = {'Id':1};
      //$scope.ordenPago.UnidadEjecutora = {'Id': 1};
      $scope.ordenPago.EstadoOrdenPago = {'Id': 1};
      console.log($scope.ordenPago)

      financieraRequest.post("orden_pago", $scope.ordenPago)
        .then(function(data) {   //error con el success
          console.log("insert");
          $scope.ServerResponse = data;
          console.log(data);
        })/* error no reconoce funcion error
        .error(function(data, status, headers, config) {
          // this isn't happening:
          console.debug("saved comment", $scope.comment);
        })*/
    }
    //
    $scope.go = function(path){
      $location.url(path);
    };

  });
