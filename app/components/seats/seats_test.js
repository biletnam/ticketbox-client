'use strict';

describe('ticketbox.components.seats', function () {
    var scope,
        fbarray,
        fbobject,
        locker,
        byPathSpy,
        byChildValueSpy,
        byIdSpy,
        unlockSpy,
        myLocksSaveSpy,
        getMyLocksSpy;

    beforeEach(function () {
        module('ticketbox.components.seats');

        inject(function (_$rootScope_, _fbarray_, _fbobject_, _locker_, $controller) {
            scope = _$rootScope_.$new();

            fbarray = _fbarray_;
            byPathSpy = spyOn(fbarray, 'byPath');
            byChildValueSpy = spyOn(fbarray, 'byChildValue');

            fbobject = _fbobject_;
            byIdSpy = spyOn(fbobject, 'byId');

            locker = _locker_;
            unlockSpy = spyOn(locker, 'unlockWithLock');
            var myLocks = {
                '$save': function() {}
            };
            myLocksSaveSpy = spyOn(myLocks, '$save');
            getMyLocksSpy = spyOn(locker, 'getMyLocks').and.returnValue(myLocks);


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

        describe('$scope.allCategories', function () {
            it('should fetch all categories', function() {
                expect(byPathSpy).toHaveBeenCalledWith('/categories');
            });
        });

        describe('$scope.saveLock()', function() {
            it('should save the given lock', function() {
                var lock = { };
                expect(myLocksSaveSpy).not.toHaveBeenCalled();
                scope.saveLock(lock);
                expect(myLocksSaveSpy).toHaveBeenCalledWith(lock);
            });
        });

        describe('$scope.unlock()', function () {
            it('should unlock the given seat', function () {
                var lock = {
                    '$id': 'eid1:sid1'
                };

                expect(unlockSpy).not.toHaveBeenCalled();
                scope.unlock(lock);
                expect(unlockSpy).toHaveBeenCalledWith(lock);
            });
        });
    });

});