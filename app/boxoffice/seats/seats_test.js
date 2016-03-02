'use strict';

describe('ticketbox.customer.seats', function () {
    var scope,
        fbarray,
        fbobject,
        locker,
        byPathSpy,
        byChildValueSpy,
        byIdSpy,
        unlockSpy,
        getMyLocksSpy;

    beforeEach(function () {
        module('ticketbox.customer.seats');

        inject(function (_$rootScope_, _fbarray_, _fbobject_, _locker_, $controller) {
            scope = _$rootScope_.$new();

            fbarray = _fbarray_;
            byPathSpy = spyOn(fbarray, 'byPath');
            byChildValueSpy = spyOn(fbarray, 'byChildValue');

            fbobject = _fbobject_;
            byIdSpy = spyOn(fbobject, 'byId');

            locker = _locker_;
            unlockSpy = spyOn(locker, 'unlock');
            getMyLocksSpy = spyOn(locker, 'getMyLocks');

            var routeParams = {
                eventId: 'eid1',
                blockId: 'bid1',
                categoryId: 'cid1'
            };

            $controller('SeatsCtrl', {$scope: scope, fbarray: fbarray, fbobject: fbobject, locker: locker, $routeParams: routeParams});
            scope.$digest();
        });
    });

    describe('SeatsCtrl', function () {
        describe('$scope.event', function () {
            it('should fetch event', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/events', 'eid1');
            });
        });

        describe('$scope.category', function () {
            it('should fetch category', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/categories', 'cid1');
            });
        });

        describe('$scope.block', function () {
            it('should fetch block', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/blocks', 'bid1');
            });
        });

        describe('$scope.seats', function () {
            it('should fetch seats', function () {
                expect(byChildValueSpy).toHaveBeenCalledWith('/seats', 'blockId', 'bid1');
            });
        });

        describe('$scope.reservations', function () {
            it('should fetch reservations for event', function() {
                expect(byChildValueSpy).toHaveBeenCalledWith('/reservations', 'eventId', 'eid1');
            });
        });

        describe('$scope.myLocks', function () {
            it('should fetch locks from locker', function() {
                expect(getMyLocksSpy).toHaveBeenCalled();
            });
        });

        describe('$scope.allEvents', function () {
            it('should fetch all events', function() {
                expect(byPathSpy).toHaveBeenCalledWith('/events');
            });
        });

        describe('$scope.allSeats', function () {
            it('should fetch all seats', function() {
                expect(byPathSpy).toHaveBeenCalledWith('/seats');
            });
        });

        describe('$scope.allBlocks', function () {
            it('should fetch all blocks', function() {
                expect(byPathSpy).toHaveBeenCalledWith('/blocks');
            });
        });

        describe('$scope.unlock()', function () {
            it('should unlock the given seat', function () {
                var lock = {
                    '$id': 'eid1:sid1'
                };

                expect(unlockSpy).not.toHaveBeenCalled();
                scope.unlock(lock);
                expect(unlockSpy).toHaveBeenCalledWith('eid1', 'sid1');
            });
        });
    });

});