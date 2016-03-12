'use strict';

describe('ticketbox.boxoffice.order', function () {
    var scope,
        fbarray,
        byPathSpy,
        byChildValueSpy,
        fbobject,
        byIdSpy,
        locker,
        unlockSpy;

    beforeEach(function () {
        module('ticketbox.components.utils');
        module('ticketbox.boxoffice.order');

        inject(function (_$rootScope_, _fbarray_, _fbobject_, _locker_, $controller) {
            scope = _$rootScope_.$new();

            fbarray = _fbarray_;
            byPathSpy = spyOn(fbarray, 'byPath');
            var list = {
                '$save': function() {}
            };
            byChildValueSpy = spyOn(fbarray, 'byChildValue').and.returnValue(list);

            fbobject = _fbobject_;
            byIdSpy = spyOn(fbobject, 'byId');

            locker = _locker_;
            unlockSpy = spyOn(locker, 'unlockWithLock');

            var routeParams = {
                orderId: 'id1'
            };

            $controller('OrderCtrl', {$scope: scope, fbarray: fbarray, locker: locker, $routeParams: routeParams});
            scope.$digest();
        });
    });

    describe('CheckoutCtrl', function () {
        describe('$scope.order', function () {
            it('should fetch the order', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/orders', 'id1');
            });
        });

        describe('$scope.reservations', function () {
            it('should fetch all reservations for the given order id', function () {
                expect(byChildValueSpy).toHaveBeenCalledWith('/reservations', 'orderId', 'id1');
            });
        });

        describe('$scope.events', function () {
            it('should fetch all events', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/events');
            });
        });

        describe('$scope.seats', function () {
            it('should fetch all seats', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/seats');
            });
        });

        describe('$scope.blocks', function () {
            it('should fetch all blocks', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/blocks');
            });
        });

        describe('$scope.saveLock()', function() {
            it('should save the given lock', function() {
                var reservationsSaveSpy = spyOn(scope.reservations, '$save');
                var reservation = { };
                expect(reservationsSaveSpy).not.toHaveBeenCalled();
                scope.saveReservation(reservation);
                expect(reservationsSaveSpy).toHaveBeenCalledWith(reservation);
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

        describe('$scope.sell()', function () {
            it('should set isSold=true for the order and save it', function () {
                var order = {
                    '$save': function () { }
                };
                var saveSpy = spyOn(order, '$save');
                var reservations = [];

                expect(saveSpy).not.toHaveBeenCalled();
                expect(order.isSold).toBeUndefined();
                scope.sell(order, reservations);
                expect(saveSpy).toHaveBeenCalled();
                expect(order.isSold).toBeTruthy();
            });

            it('should set isSold=true for all reservations and save each of them', function () {
                var order = {
                    '$save': function () {
                    }
                };
                var reservation0 = {};
                var reservation1 = {};
                var reservations = {
                    '$save': function() {},
                    0: reservation0,
                    1: reservation1
                };

                var saveSpy = spyOn(reservations, '$save');
                expect(saveSpy).not.toHaveBeenCalled();
                _.each(reservations, function(reservation) {
                    expect(reservation.isSold).toBeUndefined();
                });
                scope.sell(order, reservations);
                expect(saveSpy).toHaveBeenCalledWith(reservation0);
                expect(saveSpy).toHaveBeenCalledWith(reservation1);
                _.each(reservations, function(reservation) {
                    expect(reservation.isSold).toBeTruthy();
                });
            });
        });
    });
});