'use strict';

angular.module('ticketbox.boxoffice.seats', [
        'ticketbox.components.seats',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/seats/:eventId/:categoryId/:blockId', {
            controller: 'SeatsCtrl',
            templateUrl: 'boxoffice/seats/seats.html'
        });
    }]);