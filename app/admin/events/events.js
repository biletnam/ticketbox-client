'use strict';

angular.module('ticketbox.admin.events', ['ticketbox.firebase.utils', 'ticketbox.controller.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/events', {
            controller: 'EventsCtrl',
            templateUrl: 'admin/events/events.html'
        });
    }])

    .controller('EventsCtrl', function ($scope, $location, array, error) {
        $scope.error = null;

        $scope.events = array.byPath('/events');

        $scope.newEventName = '';

        $scope.add = function(name) {
            $scope.events.$add({ 'name': name })
                .then(function () { }, error)
                .finally(function() {
                    $scope.newEventName = '';
                }
            );
        };

        $scope.remove = function(event) {
            $scope.events.$remove(event).then(function () { }, error);
        };
    });
