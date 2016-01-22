'use strict';

angular.module('ticketbox.admin.events', ['ticketbox.firebase.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/events', {
            controller: 'EventsCtrl',
            templateUrl: 'admin/events/events.html'
        });
    }])

    .controller('EventsCtrl', function ($scope, $location, array) {
        $scope.err = null;

        $scope.events = array('/events');

        $scope.newEventName = '';

        $scope.add = function(name) {
            $scope.events.$add({ 'name': name }).then(
                function () {
                },
                function (err) {
                    $scope.err = _errMessage(err);
                }
            ).finally(
                function() {
                    $scope.newEventName = '';
                }
            );
        };

        $scope.remove = function(event) {
            $scope.events.$remove(event).then(
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
