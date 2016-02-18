'use strict';

angular.module('ticketbox.boxoffice.logout', ['ticketbox.components.firebase', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/logout', {
            controller: 'LogoutCtrl',
            templateUrl: 'boxoffice/logout/logout.html'
        });
    }])

    .controller('LogoutCtrl', function ($scope, passwordAuth, $location) {
        passwordAuth.logout();
        $location.path('/login');
    });