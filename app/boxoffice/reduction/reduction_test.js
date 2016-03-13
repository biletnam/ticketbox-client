'use strict';

describe('ticketbox.boxoffice.reduction', function () {
    describe('reductionCalculator', function () {
        var reductionCalculator;

        beforeEach(module('ticketbox.boxoffice.reduction'));

        beforeEach(inject(function (_reductionCalculator_) {
            reductionCalculator = _reductionCalculator_;
        }));

        describe('calculateReducedPrice()', function () {
            it('should apply absolute reduction', function () {
                var price = 10;
                var event = {
                    absoluteBoxofficeReduction: 5,
                    relativeBoxofficeReduction: 0
                };
                var reducedPrice = reductionCalculator.calculateReducedPrice(price, event);
                expect(reducedPrice).toEqual(5);
            });

            it('should apply relative reduction', function () {
                var price = 10;
                var event = {
                    absoluteBoxofficeReduction: 0,
                    relativeBoxofficeReduction: 0.1
                };
                var reducedPrice = reductionCalculator.calculateReducedPrice(price, event);
                expect(reducedPrice).toEqual(9);
            });

            it('should apply first relative and then absolute reduction', function () {
                var price = 10;
                var event = {
                    absoluteBoxofficeReduction: 5,
                    relativeBoxofficeReduction: 0.1
                };
                var reducedPrice = reductionCalculator.calculateReducedPrice(price, event);
                expect(reducedPrice).toEqual(4);
            });
        });
    });
});