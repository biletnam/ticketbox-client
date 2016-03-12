'use strict';

angular.module('ticketbox.components.seats', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ticketbox.components.locker',
        'ticketbox.components.seatplan',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/seats/:eventId/:blockId', {
            controller: 'SeatsCtrl',
            templateUrl: 'components/seats/seats.html'
        });
    }])

    .controller('SeatsCtrl', function ($scope, $routeParams, fbarray, fbobject, locker, separator, messages) {
        $scope.event = fbobject.byId('/events', $routeParams.eventId);
        $scope.block = fbobject.byId('/blocks', $routeParams.blockId);
        $scope.seats = fbarray.byChildValue('/seats', 'blockId', $routeParams.blockId);
        $scope.reservations = locker.getLocksOfEvent($routeParams.eventId);
        $scope.myLocks = locker.getMyLocks();
        $scope.allEvents = fbarray.byPath('/events');
        $scope.allSeats = fbarray.byPath('/seats');
        $scope.allBlocks = fbarray.byPath('/blocks');
        $scope.allCategories = fbarray.byPath('/categories');

        $scope.numberOfSeatsToBeLocked = 0;

        $scope.reserve = function(numberOfSeatsToBeLocked) {
            if (numberOfSeatsToBeLocked === 0) {
                return;
            }

            var eventId = $routeParams.eventId;
            var numberOfFetchedLocks = 0;
            locker.getLocksOfEvent(eventId).$loaded(function(locks) {
                var initialNumberOfLockedSeats = $scope.myLocks.length;

                _.each($scope.seats, function(seat) {
                    var lockedSeatIds = _.map(locks, function(lock) { return lock.seatId; });
                    if (numberOfFetchedLocks < numberOfSeatsToBeLocked && !_.contains(lockedSeatIds, seat.$id)) {
                        locker.lock(eventId, seat.$id);
                        numberOfFetchedLocks += 1;
                    }
                });
                if (numberOfFetchedLocks < numberOfSeatsToBeLocked) {
                    var eventualNumberOfLockedSeats = initialNumberOfLockedSeats + numberOfFetchedLocks;
                    if (eventualNumberOfLockedSeats === 0) {
                        messages.notify('Sorry, we are sold out in this block.');
                    } else {
                        messages.notify('Not enough seats available. ' + eventualNumberOfLockedSeats + ' are reserved for you.');
                    }
                }
                $scope.numberOfSeatsToBeLocked = 0;
            });
        };

        $scope.saveLock = function(lock) {
            $scope.myLocks.$save(lock);
        };

        $scope.unlock = function (lock) {
            var eventId = lock.$id.split(separator)[0];
            var seatId = lock.$id.split(separator)[1];
            locker.unlock(eventId, seatId);
        };
    });