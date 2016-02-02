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

    .run(function($rootScope, fbauth) {
        // track status of authentication
        fbauth.$onAuth(function(user) {
            $rootScope.loggedIn = !!user;
        });
    });