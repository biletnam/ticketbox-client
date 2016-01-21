'use strict';

angular.module('ticketbox.admin', [
        'ticketbox.config',
        'ticketbox.admin.login',
        'ticketbox.admin.logout',
        'ticketbox.admin.events',
        'ticketbox.admin.blocks',
        'ticketbox.admin.categories'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/login'
        });
    }])

    .run(['$rootScope', 'auth', function($rootScope, auth) {
        // track status of authentication
        auth.$onAuth(function(user) {
            $rootScope.loggedIn = !!user;
        });
    }]);