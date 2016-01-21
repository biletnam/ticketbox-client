'use strict';

angular.module('ticketbox.admin.login', ['ticketbox.firebase.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            controller: 'LoginCtrl',
            templateUrl: 'admin/login/login.html'
        });
    }])

    .controller('LoginCtrl', function ($scope, passwordAuth, $location) {
        $scope.login = function (email, pass) {
            $scope.err = null;
            passwordAuth.login(email, pass)
                .then(function (/* user */) {
                    $location.path('/events');
                }, function (err) {
                    $scope.err = _errMessage(err);
                });
        };

        function _errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }
    });
