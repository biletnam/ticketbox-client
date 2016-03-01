'use strict';

angular.module('ticketbox.boxoffice', [
        'ticketbox.config',
        'ticketbox.components.locker',
        'ticketbox.boxoffice.login',
        'ticketbox.boxoffice.logout',
        'ticketbox.boxoffice.events',
        'ticketbox.boxoffice.blocks',
        'ticketbox.boxoffice.seats',
        'ticketbox.boxoffice.orders',
        'ticketbox.boxoffice.order'])

    .config(function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/login'
        });
    })

    .run(function($rootScope, $location, fbauth, locker) {
        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            if ($rootScope.loggedIn !== undefined && !$rootScope.loggedIn) {
                if (next.controller === 'LoginCtrl') {
                    // already going to login, do nothing and go further
                } else {
                    $location.path('/login');
                }
            }
        });

        // track status of authentication
        fbauth.$onAuth(function(user) {
            $rootScope.loggedIn = !!user;
            $rootScope.authData = user;
            if (!$rootScope.loggedIn) {
                $location.path('/login');
            } else {
                $interval(locker.deleteStaleLocks, 5 * 1000);
            }
        });
    });