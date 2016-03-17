'use strict';

angular.module('ticketbox.boxoffice.seats', ['ticketbox.components.seats'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/seats/:eventId/:blockId', {
            controller: 'SeatsCtrl',
            templateUrl: 'boxoffice/seats/seats.html'
        });
    }])