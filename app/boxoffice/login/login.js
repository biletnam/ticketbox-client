'use strict';

angular.module('ticketbox.boxoffice.login', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            controller: 'LoginCtrl',
            templateUrl: 'boxoffice/login/login.html'
        });
    }])

    .controller('LoginCtrl', function ($rootScope, $scope, passwordAuth, $location, error) {
        $scope.login = function (email, pass) {
            passwordAuth.login(email, pass)
                .then(function (authData) {
                    $location.path('/events');
                }, error);
        };
    });
