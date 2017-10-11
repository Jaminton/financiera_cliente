'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:ordenPago/proveedor/opProveedorUpdateDetalleOrdenPago
 * @description
 * # ordenPago/proveedor/opProveedorUpdateDetalleOrdenPago
 */
angular.module('financieraClienteApp')
  .directive('opProveedorUpdateDetalleOrdenPago', function(financieraRequest, arkaRequest) {
    return {
      restrict: 'E',
      scope: {
        inputpestanaabierta: '=?',
        inputpreviusdata: '=?',
        inputproveedor: '=',
        outputnewdataselect: '=?'
      },

      templateUrl: 'views/directives/orden_pago/proveedor/op_proveedor_update_detalle_orden_pago.html',
      controller: function($scope) {
        var self = this;
        self.entrada = {};

        $scope.$watch('inputpreviusdata', function() {
          if ($scope.inputpreviusdata != undefined) {
            $scope.outputnewdataselect = {};
            $scope.outputnewdataselect.SubTipoOrdenPago = $scope.inputpreviusdata.SubTipoOrdenPago;
            $scope.outputnewdataselect.FormaPago = $scope.inputpreviusdata.FormaPago;
            $scope.outputnewdataselect.ValorBase = $scope.inputpreviusdata.ValorBase;
            $scope.outputnewdataselect.EntradaAlmacen = $scope.inputpreviusdata.EntradaAlmacen;
            $scope.outputnewdataselect.Id = $scope.inputpreviusdata.Id; //Id Orden Pago
            //consultar entrada registrada
            arkaRequest.get('entrada',
              $.param({
                query: "Id:" + $scope.inputpreviusdata.EntradaAlmacen,
              })
            ).then(function(response) {
              self.entrada.selected = response.data[0];
            });
            self.ver_seleccion = function($item, $model) {
              if($item != undefined){
                $scope.outputnewdataselect.EntradaAlmacen = $item.Id;
              }else{
                $scope.outputnewdataselect.EntradaAlmacen = 0;
              }
            }
            //sub_tipo_documentos
            financieraRequest.get('sub_tipo_orden_pago',
              $.param({
                query: "TipoOrdenPago.CodigoAbreviacion:OP-PROV",
                limit: 0
              })
            ).then(function(response) {
              self.subTiposOrdenPago = response.data;
            });
            //forma de pago
            financieraRequest.get('forma_pago',
              $.param({
                limit: 0
              })
            ).then(function(response) {
              self.formaPagos = response.data;
            });
          }
          //
          if ($scope.inputpestanaabierta) {
            $scope.a = true;
          }
        })
        //entradas almacen
        $scope.$watch('inputproveedor', function() {
          if ($scope.inputproveedor != undefined) {
            arkaRequest.get('entrada',
              $.param({
                query: 'Proveedor:' + $scope.inputproveedor,
                limit: -1,
              })
            ).then(function(response) {
              self.entradas = response.data;
            });
          }
        });
        //fin
      },
      controllerAs: 'd_opProveedorUpdateDetalleOrdenPago'
    };
  });
