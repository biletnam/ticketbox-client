'use strict';

angular.module('ticketbox.admin.block', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/block/:blockId', {
            controller: 'BlockCtrl',
            templateUrl: 'admin/block/block.html'
        });
    }])

    .controller('BlockCtrl', function($scope, $routeParams, $location, fbobject) {
        $scope.block = fbobject.byId('/blocks', $routeParams.blockId);

        $scope.saveAndReturnToList = function(block) {
            block.$save();
            $location.path('/blocks');
        };
    });