'use strict';

describe('ticketbox.customer.price', function () {
    describe('seatPriceFilter', function () {
        var seatPriceFilter, priceString;

        beforeEach(function () {
            angular.mock.module('ticketbox.customer.price', function ($provide) {
                priceString = {
                    seat: function() {},
                    total: function() {}
                };
                $provide.value('priceString', priceString);
            });

            inject(function ($filter) {
                seatPriceFilter = $filter('seatPriceFilter', {});
            });
        });

        it('should use seatString service without reductionCalculator', function() {
            var seatSpy = spyOn(priceString, 'seat').and.returnValue('priceString');
            var seatPrice = seatPriceFilter('lock', 'seats', 'events', 'categories');
            expect(seatPrice).toEqual('priceString');
            expect(seatSpy).toHaveBeenCalledWith('lock', 'seats', 'events', 'categories');
        });
    });

    describe('totalPriceFilter', function () {
        var totalPriceFilter, priceString;

        beforeEach(function () {
            angular.mock.module('ticketbox.customer.price', function ($provide) {
                priceString = {
                    seat: function() {},
                    total: function() {}
                };
                $provide.value('priceString', priceString);
            });

            inject(function ($filter) {
                totalPriceFilter = $filter('totalPriceFilter', {});
            });
        });

        it('should use seatString service without reductionCalculator', function() {
            var totalSpy = spyOn(priceString, 'total').and.returnValue('priceString');
            var totalPrice = totalPriceFilter('lock', 'seats', 'events', 'categories');
            expect(totalPrice).toEqual('priceString');
            expect(totalSpy).toHaveBeenCalledWith('lock', 'seats', 'events', 'categories');
        });
    });
});