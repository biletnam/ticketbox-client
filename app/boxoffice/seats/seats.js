'use strict';

angular.module('ticketbox.boxoffice.seats', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ticketbox.components.seatplan',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/seats/:eventId/:categoryId/:blockId', {
            controller: 'SeatsCtrl',
            templateUrl: 'boxoffice/seats/seats.html'
        });
    }])

    .controller('SeatsCtrl', function ($scope, $routeParams, fbarray, fbobject, locker) {
        $scope.event = fbobject.byId('/events', $routeParams.eventId);
        $scope.category = fbobject.byId('/categories', $routeParams.categoryId);
        $scope.block = fbobject.byId('/blocks', $routeParams.blockId);
        $scope.seats = fbarray.byChildValue('/seats', 'blockId', $routeParams.blockId);
        $scope.reservations = locker.getLocksOfEvent($routeParams.eventId);
    });