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
        $scope.newCategoryPrice = '';
        $scope.newCategoryReducedPrice = '';

        $scope.add = function(name, price, reducedPrice) {
            $scope.categories.$add({ 'name': name, 'price': price, 'reducedPrice': reducedPrice })
                .then(function () { }, error)
                .finally(function() {
                    $scope.newCategoryName = '';
                    $scope.newCategoryPrice = '';
                    $scope.newCategoryReducedPrice = '';
                }
            );
        };

        $scope.remove = function(category) {
            $scope.categories.$remove(category).then(function () { }, error);
        };
    });
