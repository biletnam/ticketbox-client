'use strict';

angular.module('ticketbox.boxoffice', [
        'ticketbox.config',
        'ticketbox.boxoffice.login',
        'ticketbox.boxoffice.logout',
        'ticketbox.boxoffice.events',
        'ticketbox.boxoffice.blocks',
        'ticketbox.boxoffice.seats'])

    .config(function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/login'
        });
    })

    .run(function($rootScope, $location, fbauth) {
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
            }
        });
    });