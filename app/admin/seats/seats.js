'use strict';

angular.module('ticketbox.admin.seats', ['ticketbox.firebase.utils', 'ticketbox.controller.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/seats', {
            controller: 'SeatsCtrl',
            templateUrl: 'admin/seats/seats.html'
        });
    }])

    .controller('SeatsCtrl', function ($scope, $location, $q, array, object, arrayModification, error) {
        $scope.error = null;

        $scope.blocks = array.byPath('/blocks');
        $scope.block = null;
        $scope.seats = [];

        $scope.namePattern = '';
        $scope.startSeatNumber = 1;
        $scope.endSeatNumber = 1;

        $scope.filterSeats = function(blockId) {
            $scope.block = object.byId('/blocks', blockId);
            $scope.seats = array.byChildValue('/seats', 'blockId', blockId);
        };

        $scope.add = function(blockId, namePattern, startNumber, endNumber) {
            var promises = [];
            for (var seatNumber = startNumber; seatNumber <= endNumber; seatNumber += 1) {
                var name = '';
                if (namePattern.indexOf('{i}') != -1) {
                    name = namePattern.replace('{i}', seatNumber);
                } else {
                    name = namePattern;
                }
                promises.push($scope.seats.$add({ 'blockId': blockId, 'name': name }));
            }
            $q.all(promises)
                .then(function() { }, error)
                .finally(function() {
                    $scope.namePattern = '';
                    $scope.startSeatNumber = 1;
                    $scope.endSeatNumber = 1;
                }
            );
        };

        $scope.remove = function(seat) {
            $scope.seats.$remove(seat).then(function () { }, error);
        };

        $scope.removeAll = function() {
            arrayModification.removeAll($scope.seats).then(function() { }, error);
        };
    });
