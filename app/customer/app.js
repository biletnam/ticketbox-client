'use strict';

angular.module('ticketbox.customer', [
        'ticketbox.config',
        'ticketbox.components.utils',
        'ticketbox.components.seatplan',
        'ticketbox.customer.events',
        'ticketbox.customer.blocks',
        'ticketbox.customer.seats',
        'ticketbox.customer.checkout'])

    .config(function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/events'
        });
    })

    .run(function ($rootScope, $location, anonymousAuth, error) {
        if (anonymousAuth.isLoggedIn()) {
            $rootScope.authData = anonymousAuth.getAuthData();
        } else {
            anonymousAuth.login().then(function (authData) {
                $rootScope.authData = authData;
            }, error);
        }
    });