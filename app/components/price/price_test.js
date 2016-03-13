'use strict';

describe('ticketbox.components.price', function () {
    describe('priceCalculator', function () {
        var priceCalculator;

        beforeEach(module('ticketbox.components.price', function ($provide) {
            $provide.value('separator', ':');
        }));

        beforeEach(inject(function (_priceCalculator_) {
            priceCalculator = _priceCalculator_;
        }));

        describe('calculate()', function () {
            it('should select price from category', function () {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': false
                };
                var seats = [
                    {'$id': 'sid1', 'blockId': 'bid1'}
                ];
                var events = [
                    {
                        '$id': 'eid1', 'blocks': [
                        {'blockId': 'bid1', 'categoryId': 'cid1'}
                    ]
                    }
                ];
                var categories = [
                    {'$id': 'cid1', 'price': 10, 'reducedPrice': 5}
                ];
                var seatPrice = priceCalculator.calculate(lock, seats, events, categories);
                expect(seatPrice).toEqual(10);
            });

            it('should select reduced price from category', function () {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': true
                };
                var seats = [
                    {'$id': 'sid1', 'blockId': 'bid1'}
                ];
                var events = [
                    {
                        '$id': 'eid1', 'blocks': [
                        {'blockId': 'bid1', 'categoryId': 'cid1'}
                    ]
                    }
                ];
                var categories = [
                    {'$id': 'cid1', 'price': 10, 'reducedPrice': 5}
                ];
                var seatPrice = priceCalculator.calculate(lock, seats, events, categories);
                expect(seatPrice).toEqual(5);
            });

            it('should return null if seat cannot be found', function () {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': false
                };
                var seats = [];
                var events = [];
                var categories = [];
                var seatPrice = priceCalculator.calculate(lock, seats, events, categories);
                expect(seatPrice).toEqual(null);
            });

            it('should return null if event cannot be found', function () {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': false
                };
                var seats = [
                    {'$id': 'sid1', 'blockId': 'bid1'}
                ];
                var events = [];
                var categories = [];
                var seatPrice = priceCalculator.calculate(lock, seats, events, categories);
                expect(seatPrice).toEqual(null);
            });

            it('should return null if eventblock cannot be found', function () {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': false
                };
                var seats = [
                    {'$id': 'sid1', 'blockId': 'bid1'}
                ];
                var events = [
                    {'$id': 'eid1', 'blocks': []}
                ];
                var categories = [];
                var seatPrice = priceCalculator.calculate(lock, seats, events, categories);
                expect(seatPrice).toEqual(null);
            });

            it('should return null if category cannot be found', function () {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': false
                };
                var seats = [
                    {'$id': 'sid1', 'blockId': 'bid1'}
                ];
                var events = [
                    {
                        '$id': 'eid1', 'blocks': [
                        {'blockId': 'bid1', 'categoryId': 'cid1'}
                    ]
                    }
                ];
                var categories = [];
                var seatPrice = priceCalculator.calculate(lock, seats, events, categories);
                expect(seatPrice).toEqual(null);
            });

            it('should return reduced price if reductionCalculator is provided', function () {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': false
                };
                var seats = [
                    {'$id': 'sid1', 'blockId': 'bid1'}
                ];
                var events = [
                    {
                        '$id': 'eid1', 'blocks': [
                        {'blockId': 'bid1', 'categoryId': 'cid1'}
                    ]
                    }
                ];
                var categories = [
                    {'$id': 'cid1', 'price': 10, 'reducedPrice': 5}
                ];
                var reductionCalculator = {
                    calculateReducedPrice: function (price, event) {
                        return price - 1;
                    }
                };
                var seatPrice = priceCalculator.calculate(lock, seats, events, categories);
                var reducedSeatPrice = priceCalculator.calculate(lock, seats, events, categories, reductionCalculator);
                expect(reducedSeatPrice).toEqual(seatPrice - 1);
            });
        });
    });

    describe('priceString', function () {
        var priceString, currency, priceCalculator;

        beforeEach(module('ticketbox.components.price', function ($provide) {
            $provide.value('separator', ':');
            currency = 'USD';
            $provide.value('CURRENCY', currency);
        }));

        beforeEach(inject(function (_priceString_, _priceCalculator_) {
            priceString = _priceString_;
            priceCalculator = _priceCalculator_;
        }));

        describe('seat()', function() {
            it('should return price with currency', function () {
                var calculateSpy = spyOn(priceCalculator, 'calculate').and.returnValue(10);
                var seatPrice = priceString.seat('lock', 'seats', 'events', 'categories');
                expect(calculateSpy).toHaveBeenCalledWith('lock', 'seats', 'events', 'categories', undefined);
                expect(seatPrice).toEqual('10 ' + currency);
            });

            it('should return empty string if price is null', function () {
                var seatSpy = spyOn(priceCalculator, 'calculate').and.returnValue(null);
                var seatPrice = priceString.seat('lock', 'seats', 'events', 'categories');
                expect(seatSpy).toHaveBeenCalledWith('lock', 'seats', 'events', 'categories', undefined);
                expect(seatPrice).toEqual('');
            });
        });

        describe('total()', function() {
            it('should return sum of prices with currency', function () {
                var calculateSpy = spyOn(priceCalculator, 'calculate').and.returnValue(10);
                var locks = ['lock1', 'lock2', 'lock3'];
                var totalPrice = priceString.total(locks, 'seats', 'events', 'categories');
                expect(calculateSpy).toHaveBeenCalledTimes(3);
                expect(calculateSpy).toHaveBeenCalledWith('lock1', 'seats', 'events', 'categories', undefined);
                expect(calculateSpy).toHaveBeenCalledWith('lock2', 'seats', 'events', 'categories', undefined);
                expect(calculateSpy).toHaveBeenCalledWith('lock3', 'seats', 'events', 'categories', undefined);
                expect(totalPrice).toEqual('30 ' + currency);
            });

            it('should return empty string if at least one price is null', function () {
                var calculateSpy = spyOn(priceCalculator, 'calculate').and.returnValue(null);
                var locks = ['lock1', 'lock2', 'lock3'];
                var totalPrice = priceString.total(locks, 'seats', 'events', 'categories');
                expect(calculateSpy).toHaveBeenCalledTimes(3);
                expect(calculateSpy).toHaveBeenCalledWith('lock1', 'seats', 'events', 'categories', undefined);
                expect(calculateSpy).toHaveBeenCalledWith('lock2', 'seats', 'events', 'categories', undefined);
                expect(calculateSpy).toHaveBeenCalledWith('lock3', 'seats', 'events', 'categories', undefined);
                expect(totalPrice).toEqual('');
            });
        });
    });
});