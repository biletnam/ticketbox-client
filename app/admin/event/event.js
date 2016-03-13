'use strict';

angular.module('ticketbox.admin.event', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/events/:eventId', {
            controller: 'EventCtrl',
            templateUrl: 'admin/event/event.html'
        });
    }])

    .controller('EventCtrl', function($scope, $routeParams, $location, fbobject, fbarray, error) {
        $scope.event = fbobject.byId('/events', $routeParams.eventId);
        $scope.eventBlocks = fbarray.byPath('/events/' + $routeParams.eventId + '/blocks');

        $scope.blocks = fbarray.byPath('/blocks');
        $scope.categories = fbarray.byPath('/categories');

        $scope.addBlock = function(blockId, categoryId) {
            $scope.eventBlocks.$add({ 'blockId': blockId, 'categoryId': categoryId })
                .then(function() { }, error)
                .finally(function() {
                    $scope.newBlockId = undefined;
                    $scope.newCategoryId = undefined;
                });
        };

        $scope.saveAndReturnToList = function(event) {
            event.$save();
            $location.path('/events');
        };

        $scope.removeBlock = function(eventBlock) {
            $scope.eventBlocks.$remove(eventBlock).then(function () { }, error);
        };
    });