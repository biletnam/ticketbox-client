'use strict';

angular.module('ticketbox.admin.login', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            controller: 'LoginCtrl',
            templateUrl: 'admin/login/login.html'
        });
    }])

    .controller('LoginCtrl', function ($scope, passwordAuth, $location, error) {
        $scope.login = function (email, pass) {
            passwordAuth.login(email, pass)
                .then(function () {
                    $location.path('/events');
                }, error);
        };
    });
