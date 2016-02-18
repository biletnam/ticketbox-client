'use strict';

angular.module('ticketbox.boxoffice.events', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/events', {
            controller: 'EventsCtrl',
            templateUrl: 'boxoffice/events/events.html'
        });
    }])

    .controller('EventsCtrl', function ($scope, $location, fbarray) {
        $scope.events = fbarray.byPath('/events');
    });
