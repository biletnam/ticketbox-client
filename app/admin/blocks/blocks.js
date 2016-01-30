'use strict';

angular.module('ticketbox.admin.blocks', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ticketbox.components.upload', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/blocks', {
            controller: 'BlocksCtrl',
            templateUrl: 'admin/blocks/blocks.html'
        });
    }])

    .controller('BlocksCtrl', function ($scope, $location, fbarray, arrayModification, error) {
        $scope.error = null;

        $scope.blocks = fbarray.byPath('/blocks');

        $scope.newBlockName = '';
        $scope.newSeatplan = '';

        $scope.add = function(name, seatplan) {
            $scope.blocks.$add({ 'name': name, 'seatplan': seatplan })
                .then(function () { }, error)
                .finally(function() {
                    $scope.newBlockName = '';
                    $scope.newSeatplan = '';
                });
        };

        $scope.remove = function(block) {
            fbarray.byChildValue('/seats', 'blockId', block.$id).$loaded(function(s) {
                arrayModification.removeAll(s)
                    .then(function () {
                        $scope.blocks.$remove(block);
                    }, error);
            }, error);
        };
    });
