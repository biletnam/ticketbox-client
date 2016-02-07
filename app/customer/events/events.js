'use strict';

angular.module('ticketbox.customer.events', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/events', {
            controller: 'EventsCtrl',
            templateUrl: 'customer/events/events.html'
        });
    }])

    .controller('EventsCtrl', function ($scope, $location, fbarray) {
        $scope.events = fbarray.byPath('/events');
    });
