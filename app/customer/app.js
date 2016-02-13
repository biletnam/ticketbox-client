'use strict';

angular.module('ticketbox.customer', [
        'ticketbox.config',
        'ticketbox.components.utils',
        'ticketbox.customer.events',
        'ticketbox.customer.blocks',
        'ticketbox.customer.seats',
        'ticketbox.customer.checkout'])

    .config(function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/events'
        });
    })

    .run(function($rootScope, $location, fbauth, error) {
        var authData = fbauth.$getAuth();
        if (authData) {
            $rootScope.authData = authData;
        } else {
            fbauth.$authAnonymously().then(function(authData) {
                $rootScope.authData = authData;
            }, error);
        }
    });