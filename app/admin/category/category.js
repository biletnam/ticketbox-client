'use strict';

angular.module('ticketbox.admin.category', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/category/:categoryId', {
            controller: 'CategoryCtrl',
            templateUrl: 'admin/category/category.html'
        });
    }])

    .controller('CategoryCtrl', function($scope, $routeParams, $location, fbobject) {
        $scope.category = fbobject.byId('/categories', $routeParams.categoryId);

        $scope.saveAndReturnToList = function(category) {
            category.$save();
            $location.path('/categories');
        };
    });