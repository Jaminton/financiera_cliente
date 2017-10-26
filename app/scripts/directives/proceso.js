'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:proceso
 * @description
 * # proceso
 */
angular.module('financieraClienteApp')
    .directive('proceso', function() {
        return {
            restrict: 'E',
            scope: {
                nodes: '=?',
                edges: '=?',
                node: '=?',
                nodeclick: '=?',
                eventclick: '&'
            },

            templateUrl: 'views/directives/proceso.html',
            link: function(scope, elm, attrs) {

            },
            controller: function($scope) {

                var onClick = function(params) {
                    var data = {
                        Estado: { Id: this.getNodeAt(params.pointer.DOM) }
                    };
                    if ($scope.childrens.indexOf(data.Estado.Id) !== -1) {
                        $scope.nodeclick = data;
                    }
                };
                var nodes = {};
                var edges = {};
                var network = {};

                $scope.$watch('nodes', function() {
                    nodes = new vis.DataSet($scope.nodes);
                    edges = new vis.DataSet($scope.edges);
                    var container = document.getElementById('mynetwork');
                    // provide the data in the vis format
                    var data = {
                        nodes: nodes,
                        edges: edges
                    };
                    var options = {
                        nodes: {
                            color: '#BFBFBF',
                            borderWidth: 3,
                            borderWidthSelected: 1,
                            font: {
                                size: 15
                            },
                            shape: "dot"
                        },
                        edges: {
                            arrows: {
                                to: {
                                    enabled: true
                                }
                            },
                            smooth: false
                        },
                        physics: false,
                        interaction: {
                            selectable: false,
                            dragNodes: false, // do not allow dragging nodes
                            zoomView: false, // do not allow zooming
                            dragView: true // do not allow dragging
                        },
                        layout: {
                            randomSeed: 1,
                            improvedLayout: true,
                            hierarchical: {
                                enabled: true,
                                levelSeparation: 300,
                                nodeSpacing: 150,
                                treeSpacing: 10,
                                blockShifting: false,
                                edgeMinimization: true,
                                parentCentralization: true,
                                direction: 'LR', // UD, DU, LR, RL
                                sortMethod: 'directed' // hubsize, directed
                            }
                        }
                    };
                    // initialize your network!
                    network = new vis.Network(container, data, options);

                    network.on('click', onClick);

                    $scope.childrens = network.getConnectedNodes($scope.node.Id, ['to']);
                    angular.forEach($scope.childrens, function(node) {
                        var clickedNode = nodes.get(node);
                        clickedNode.color = {
                            background: '#2ECC71',
                        };
                        clickedNode.clicked = true;
                        nodes.update(clickedNode);
                    });
                    var node_active = nodes.get($scope.node.Id);

                    node_active.shape = "icon";
                    node_active.icon = {
                        face: 'FontAwesome',
                        code: '\uf058',
                        size: 60,
                        color: '#2ECC71'
                    };
                    nodes.update(node_active);


                });
                $scope.$watch('nodeclick', function() {
                    console.log("asdfasdf");
                });

            },
            controllerAs: 'd_proceso'
        };
    });