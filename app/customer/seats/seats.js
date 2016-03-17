'use strict';

angular.module('ticketbox.customer.seats', ['ticketbox.components.seats'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/seats/:eventId/:blockId', {
            controller: 'SeatsCtrl',
            templateUrl: 'customer/seats/seats.html'
        });
    }])