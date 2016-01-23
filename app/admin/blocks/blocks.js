'use strict';

angular.module('ticketbox.admin.blocks', ['ticketbox.firebase.utils', 'ticketbox.controller.utils', 'ticketbox.view.upload', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/blocks', {
            controller: 'BlocksCtrl',
            templateUrl: 'admin/blocks/blocks.html'
        });
    }])

    .controller('BlocksCtrl', function ($scope, $location, array, arrayModification) {
        $scope.err = null;

        $scope.blocks = array.byPath('/blocks');

        $scope.newBlockName = '';
        $scope.newSeatplan = '';

        $scope.add = function(name, seatplan) {
            $scope.blocks.$add({ 'name': name, 'seatplan': seatplan }).then(
                function () {
                },
                function (err) {
                    $scope.err = _errMessage(err);
                }
            ).finally(
                function() {
                    $scope.newBlockName = '';
                    $scope.newSeatplan = '';
                }
            );
        };

        $scope.remove = function(block) {
            array.byChildValue('/seats', 'blockId', block.$id).$loaded(
                function(s) {
                    arrayModification.removeAll(s).then(
                        function () {
                            $scope.blocks.$remove(block);
                        }
                        ,function (err) {
                            _errMessage(err);
                        });
                },
                function(err) {
                    $scope.err = _errMessage(err);
                });
        };

        function _errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }
    });
