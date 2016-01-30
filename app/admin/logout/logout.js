'use strict';

angular.module('ticketbox.admin.logout', ['ticketbox.components.firebase', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/logout', {
            controller: 'LogoutCtrl',
            templateUrl: 'admin/logout/logout.html'
        });
    }])

    .controller('LogoutCtrl', function ($scope, passwordAuth, $location) {
        passwordAuth.logout();
        $location.path('/login');
    });