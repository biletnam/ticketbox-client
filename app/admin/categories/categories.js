'use strict';

angular.module('ticketbox.admin.categories', ['ticketbox.firebase.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/categories', {
            controller: 'CategoriesCtrl',
            templateUrl: 'admin/categories/categories.html'
        });
    }])

    .controller('CategoriesCtrl', function ($scope, $location, array) {
        $scope.err = null;

        $scope.categories = array.byPath('/categories');

        $scope.newCategoryName = '';

        $scope.add = function(name) {
            $scope.categories.$add({ 'name': name }).then(
                function () {
                },
                function (err) {
                    $scope.err = _errMessage(err);
                }
            ).finally(
                function() {
                    $scope.newCategoryName = '';
                }
            );
        };

        $scope.remove = function(category) {
            $scope.categories.$remove(category).then(
                function () {
                },
                function (err) {
                    $scope.err = _errMessage(err);
                }
            );
        };

        function _errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }
    });
