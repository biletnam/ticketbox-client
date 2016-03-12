'use strict';

angular.module('ticketbox.customer', [
        'ticketbox.config',
        'ticketbox.components.utils',
        'ticketbox.components.locker',
        'ticketbox.components.seats',
        'ticketbox.customer.events',
        'ticketbox.customer.blocks',
        'ticketbox.customer.checkout'])

    .config(function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/events'
        });
    })

    .run(function ($rootScope, $location, $interval, anonymousAuth, error, locker) {
        if (anonymousAuth.isLoggedIn()) {
            $rootScope.authData = anonymousAuth.getAuthData();
            $interval(locker.deleteStaleLocks, 5 * 1000);
        } else {
            anonymousAuth.login().then(function (authData) {
                $rootScope.authData = authData;
                $interval(locker.deleteStaleLocks, 5 * 1000);
            }, error);
        }
    });