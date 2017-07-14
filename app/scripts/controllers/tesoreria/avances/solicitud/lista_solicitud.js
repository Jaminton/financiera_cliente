'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaAvancesListaSolicitudCtrl
 * @description
 * # TesoreriaAvancesListaSolicitudCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('ListaSolicitudCtrl', function(financieraRequest, $translate, $scope, modelsRequest) {
    var ctrl = this;
    $scope.info_validar = false;
    $scope.selected = [];
    ctrl.n_requisitos = 0;

    $scope.toggle = function(item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        item.Valido ="S";
        item.Estado = "A";
        list.push(item);
      }
    };

    $scope.exists = function(item, list) {
      return list.indexOf(item) > -1;
    };

    ctrl.get_solicitudes = function() {
      financieraRequest.get("estado_avance", $.param({
          limit: -1,
          sortby: "Id",
          order: "asc"
        }))
        .then(function(response) {
          console.log(response.data);
          angular.forEach(response.data, function(solicitud) {
            //aqui va la conexions con el beneficiario
            modelsRequest.get("terceros_completo")
              .then(function(response) {
                solicitud.Tercero = response.data;
              });
            financieraRequest.get("solicitud_tipo_avance", $.param({
                query: "SolicitudAvance.Id:" + solicitud.SolicitudAvance.Id,
                sortby: "Id",
                limit: -1,
                order: "asc"
              }))
              .then(function(response) {
                solicitud.Tipos = response.data;
                solicitud.Total = 0;
                angular.forEach(response.data, function(tipo) {
                  solicitud.Total += tipo.Valor;
                  financieraRequest.get("requisito_tipo_avance", $.param({
                      query: "TipoAvance:" + tipo.TipoAvance.Id + ",Estado:" + "A",
                      limit: -1,
                      fields: "RequisitoAvance,TipoAvance,Id",
                      sortby: "TipoAvance",
                      order: "asc"
                    }))
                    .then(function(response) {
                      ctrl.n_requisitos += response.data.length;
                      console.log(response.data);
                      tipo.Requisitos = response.data;
                    });
                });
              });

          });
          ctrl.gridOptions.data = response.data;
        });
    };

    ctrl.get_solicitudes();
    ctrl.gridOptions = {
      paginationPageSizes: [5, 15, 20],
      paginationPageSize: 5,
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      columnDefs: [
        {
          field: 'SolicitudAvance.Consecutivo',
          displayName: $translate.instant('CONSECUTIVO'),
          width: '5%',
        },{
          field: 'SolicitudAvance.Vigencia',
          displayName: $translate.instant('VIGENCIA'),
          width: '10%',
        },
        {
          field: 'SolicitudAvance.Objetivo',
          displayName: $translate.instant('OBJETIVO'),
          width: '15%',
        },
        {
          field: 'Tercero.documento',
          displayName: $translate.instant('DOCUMENTO'),
          width: '10%'
        },
        {
          field: 'Tercero.nombres',
          displayName: $translate.instant('NOMBRES'),
          width: '14%'
        },
        {
          field: 'Tercero.apellidos',
          displayName: $translate.instant('APELLIDOS'),
          width: '14%'
        },
        {
          field: 'Estado',
          displayName: $translate.instant('ESTADO'),
          cellTemplate: '<div align="center">{{row.entity.Estados.Nombre}}</div>',
          width: '8%',
        },
        {
          field: 'FechaRegistro',
          displayName: $translate.instant('FECHA'),
          cellTemplate: '<div align="center"><span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"+0900"}}</span></div>',
          width: '8%',
        },
        {
          field: 'Total',
          displayName: $translate.instant('VALOR'),
          cellTemplate: '<div align="center"><span>{{row.entity.Total | currency}}</span></div>',
          width: '8%',
        },
        {
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '8%',

          cellTemplate: '<center>' +
            //BOTON VER
            '<a class="ver" ng-click="grid.appScope.listaSolicitud.ver_fila(row.entity)" data-toggle="modal" data-target="#modal_ver">' +
            '<i class="fa fa-eye fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +

            //BOTON VALIDAR
            '<a class="ver" ng-click="grid.appScope.listaSolicitud.ver_fila(row.entity)" data-toggle="modal" data-target="#modal_validar">' +
            '<i class="fa  fa-check fa-lg  faa-shake animated-hover" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VALIDAR\' | translate }}"></i></a> ' +

            '</center>'
        }
      ]
    };

    ctrl.ver_fila = function(row) {
      $scope.solicitud = row;
      console.log($scope.solicitud);
    };
    ctrl.validar_solicitud = function(){
      var error = "";
      var i = 0;
      var j = 0;
      console.log(ctrl.n_requisitos);
      angular.forEach($scope.selected, function(registro){
        if(registro.Observaciones !== "undefined"){
            i++;
          }
          j++;
        });
      if(j <= $scope.solicitud.Tipos.lenght){
        error = "Debe llenar todas las Obervaciones<br>";
      }
      if(i<= $scope.solicitud.Tipos.lenght){
        error = "Debe seleccionar todos los requisitos";
      }
      swal(
        'Oops...',
          error,
        "error"
      );
    };

    
  });
