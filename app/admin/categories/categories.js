'use strict';

angular.module('ticketbox.admin.categories', ['ticketbox.firebase.utils', 'ticketbox.controller.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/categories', {
            controller: 'CategoriesCtrl',
            templateUrl: 'admin/categories/categories.html'
        });
    }])

    .controller('CategoriesCtrl', function ($scope, $location, array, error) {
        $scope.error = null;

        $scope.categories = array.byPath('/categories');

        $scope.newCategoryName = '';

        $scope.add = function(name) {
            $scope.categories.$add({ 'name': name })
                .then(function () { }, error)
                .finally(function() {
                    $scope.newCategoryName = '';
                }
            );
        };

        $scope.remove = function(category) {
            $scope.categories.$remove(category).then(function () { }, error);
        };
    });
