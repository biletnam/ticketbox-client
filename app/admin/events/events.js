'use strict';

angular.module('ticketbox.admin.events', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/events', {
            controller: 'EventsCtrl',
            templateUrl: 'admin/events/events.html'
        });
    }])

    .controller('EventsCtrl', function ($scope, $location, fbarray, error) {
        $scope.events = fbarray.byPath('/events');

        $scope.newEventName = '';

        $scope.add = function(name) {
            $scope.events.$add({ 'name': name, 'relativeBoxofficeReduction': 0, 'absoluteBoxofficeReduction': 0 })
                .then(function () { }, error)
                .finally(function() {
                    $scope.newEventName = '';
                });
        };

        $scope.remove = function(event) {
            $scope.events.$remove(event).then(function () { }, error);
        };
    });
