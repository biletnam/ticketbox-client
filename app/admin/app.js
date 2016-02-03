'use strict';

angular.module('ticketbox.admin', [
        'ticketbox.config',
        'ticketbox.admin.login',
        'ticketbox.admin.logout',
        'ticketbox.admin.events',
        'ticketbox.admin.event',
        'ticketbox.admin.blocks',
        'ticketbox.admin.categories',
        'ticketbox.admin.seats'])

    .config(function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/login'
        });
    })

    .run(function($rootScope, $location, fbauth) {
        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            if ($rootScope.loggedIn !== undefined && !$rootScope.loggedIn) {
                if (next.controller == 'LoginCtrl') {
                    // already going to login, do nothing and go further
                } else {
                    $location.path('/login');
                }
            }
        });

        // track status of authentication
        fbauth.$onAuth(function(user) {
            $rootScope.loggedIn = !!user;
            if (!$rootScope.loggedIn) {
                $location.path('/login');
            }
        });
    });