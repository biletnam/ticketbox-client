'use strict';

angular.module('ticketbox.boxoffice.seats', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ticketbox.components.locker',
        'ticketbox.components.seatplan',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/seats/:eventId/:categoryId/:blockId', {
            controller: 'SeatsCtrl',
            templateUrl: 'boxoffice/seats/seats.html'
        });
    }])

    .controller('SeatsCtrl', function ($scope, $routeParams, fbarray, fbobject, locker, separator) {
        $scope.event = fbobject.byId('/events', $routeParams.eventId);
        $scope.category = fbobject.byId('/categories', $routeParams.categoryId);
        $scope.block = fbobject.byId('/blocks', $routeParams.blockId);
        $scope.seats = fbarray.byChildValue('/seats', 'blockId', $routeParams.blockId);
        $scope.reservations = locker.getLocksOfEvent($routeParams.eventId);
        $scope.myLocks = locker.getMyLocks();
        $scope.allEvents = fbarray.byPath('/events');
        $scope.allSeats = fbarray.byPath('/seats');
        $scope.allBlocks = fbarray.byPath('/blocks');

        $scope.numberOfSeatsToBeLocked = 1;

        $scope.reserve = function(numberOfSeatsToBeLocked) {
            var eventId = $routeParams.eventId;
            var numberOfFetchedLocks = 0;
            locker.getLocksOfEvent(eventId).$loaded(function(locks) {
                _.each($scope.seats, function(seat) {
                    var lockedSeatIds = _.map(locks, function(lock) { return lock.seatId; });
                    if (numberOfFetchedLocks < numberOfSeatsToBeLocked && !_.contains(lockedSeatIds, seat.$id)) {
                        locker.lock(eventId, seat.$id);
                        numberOfFetchedLocks += 1;
                    }
                });
            });
        };

        $scope.unlock = function (lock) {
            var eventId = lock.$id.split(separator)[0];
            var seatId = lock.$id.split(separator)[1];
            locker.unlock(eventId, seatId);
        };
    });