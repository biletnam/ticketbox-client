'use strict';

angular.module('ticketbox.admin.categories', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/categories', {
            controller: 'CategoriesCtrl',
            templateUrl: 'admin/categories/categories.html'
        });
    }])

    .controller('CategoriesCtrl', function ($scope, $location, fbarray, error) {
        $scope.error = null;

        $scope.categories = fbarray.byPath('/categories');

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
