'use strict';

angular.module('ticketbox.admin.blocks', ['ticketbox.firebase.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/blocks', {
            controller: 'BlocksCtrl',
            templateUrl: 'admin/blocks/blocks.html'
        });
    }])

    .controller('BlocksCtrl', function ($scope, $location, array) {
        $scope.err = null;

        $scope.blocks = array('/blocks');

        $scope.newBlockName = '';

        $scope.add = function(name) {
            $scope.blocks.$add({ 'name': name }).then(
                function () {
                },
                function (err) {
                    $scope.err = _errMessage(err);
                }
            ).finally(
                function() {
                    $scope.newBlockName = '';
                }
            );
        };

        $scope.remove = function(block) {
            $scope.blocks.$remove(block).then(
                function () {
                },
                function (err) {
                    $scope.err = _errMessage(err);
                }
            );
        };

        function _errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }
    });
