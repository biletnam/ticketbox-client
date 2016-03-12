'use strict';

describe('ticketbox.customer.toolbar', function () {
    var scope,
        fbarray,
        locker,
        byPathSpy,
        getMyLocksSpy;

    beforeEach(function () {
        module('ticketbox.customer.toolbar');

        inject(function (_$rootScope_, _fbarray_, _locker_, $controller) {
            scope = _$rootScope_.$new();

            fbarray = _fbarray_;
            byPathSpy = spyOn(fbarray, 'byPath');

            locker = _locker_;
            getMyLocksSpy = spyOn(locker, 'getMyLocks');

            $controller('ToolbarCtrl', {$scope: scope, fbarray: fbarray, locker: locker});
            scope.$digest();
        });
    });

    describe('ToolbarCtrl', function () {
        describe('$scope.locks', function () {
            it('should fetch locks from locker', function () {
                expect(getMyLocksSpy).toHaveBeenCalled();
            });
        });

        describe('$scope.allEvents', function () {
            it('should fetch all events', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/events');
            });
        });

        describe('$scope.allSeats', function () {
            it('should fetch all seats', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/seats');
            });
        });

        describe('$scope.allBlocks', function () {
            it('should fetch all blocks', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/blocks');
            });
        });

        describe('$scope.allCategories', function () {
            it('should fetch all categories', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/categories');
            });
        });
    });
});