'use strict';

angular.module('ticketbox.admin.seats', ['ticketbox.firebase.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/seats', {
            controller: 'SeatsCtrl',
            templateUrl: 'admin/seats/seats.html'
        });
    }])

    .controller('SeatsCtrl', function ($scope, $location, $q, array) {
        $scope.err = null;

        $scope.seats = array('/seats');

        $scope.namePattern = '';
        $scope.startSeatNumber = 1;
        $scope.endSeatNumber = 1;

        $scope.add = function(namePattern, startNumber, endNumber) {
            var promises = [];
            for (var seatNumber = startNumber; seatNumber <= endNumber; seatNumber += 1) {
                var name = '';
                if (namePattern.indexOf('{i}') != -1) {
                    name = namePattern.replace('{i}', seatNumber);
                } else {
                    name = namePattern;
                }
                promises.push($scope.seats.$add({ 'name': name }));
            }
            $q.all(promises).then(
                function() {
                },
                function(err) {
                    _errMessage(err);
                }
            ).finally(
                function() {
                    $scope.namePattern = '';
                    $scope.startSeatNumber = 1;
                    $scope.endSeatNumber = 1;
                }
            );
        };

        $scope.remove = function(seat) {
            $scope.seats.$remove(seat).then(
                function () {
                },
                function (err) {
                    $scope.err = _errMessage(err);
                }
            );;
        };

        function _errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }
    });
