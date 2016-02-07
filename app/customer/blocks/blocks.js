'use strict';

angular.module('ticketbox.customer.blocks', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/blocks/:eventId', {
            controller: 'BlocksCtrl',
            templateUrl: 'customer/blocks/blocks.html'
        });
    }])

    .controller('BlocksCtrl', function($scope, $routeParams, fbobject, fbarray) {
        $scope.event = fbobject.byId('/events', $routeParams.eventId);
        $scope.eventBlocks = fbarray.byPath('/events/' + $routeParams.eventId + '/blocks');

        $scope.blocks = fbarray.byPath('/blocks');
        $scope.categories = fbarray.byPath('/categories');
    });