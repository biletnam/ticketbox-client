'use strict';

describe('ticketbox.components.seatlist', function () {
    describe('eventNameFilter', function () {
        var eventNameFilter;

        beforeEach(function () {
            angular.mock.module('ticketbox.components.seatlist', function ($provide) {
                $provide.value('separator', ':');
            });

            inject(function ($filter) {
                eventNameFilter = $filter('eventNameFilter', {});
            });
        });

        it('should select event and return its name', function () {
            var lock = {
                '$id': 'eid1:sid1'
            };
            var events = [
                {'$id': 'eid2', 'name': 'Event 2'},
                {'$id': 'eid1', 'name': 'Event 1'}
            ];
            var eventName = eventNameFilter(lock, events);
            expect(eventName).toEqual('Event 1');
        });

        it('should return empty string if event cannot be found', function () {
            var lock = {
                '$id': 'eid3:sid1'
            };
            var events = [
                {'$id': 'eid2', 'name': 'Event 2'},
                {'$id': 'eid1', 'name': 'Event 1'}
            ];
            var eventName = eventNameFilter(lock, events);
            expect(eventName).toEqual('');
        });
    });

    describe('seatNameFilter', function () {
        var seatNameFilter;

        beforeEach(function () {
            angular.mock.module('ticketbox.components.seatlist', function ($provide) {
                $provide.value('separator', ':');
            });

            inject(function ($filter) {
                seatNameFilter = $filter('seatNameFilter', {});
            });
        });

        it('should select seat and return its name', function () {
            var lock = {
                '$id': 'eid1:sid1'
            };
            var seats = [
                {'$id': 'sid2', 'name': 'Seat 2'},
                {'$id': 'sid1', 'name': 'Seat 1'}
            ];
            var seatName = seatNameFilter(lock, seats);
            expect(seatName).toEqual('Seat 1');
        });

        it('should return empty string if seat cannot be found', function () {
            var lock = {
                '$id': 'eid1:sid3'
            };
            var seats = [
                {'$id': 'sid2', 'name': 'Seat 2'},
                {'$id': 'sid1', 'name': 'Seat 1'}
            ];
            var seatName = seatNameFilter(lock, seats);
            expect(seatName).toEqual('');
        });
    });

    describe('blockDisplayNameFilter', function () {
        var blockDisplayNameFilter;

        beforeEach(function () {
            angular.mock.module('ticketbox.components.seatlist', function ($provide) {
                $provide.value('separator', ':');
            });

            inject(function ($filter) {
                blockDisplayNameFilter = $filter('blockDisplayNameFilter', {});
            });
        });

        it('should select block and return its display name', function () {
            var lock = {
                '$id': 'eid1:sid1'
            };
            var seats = [
                {'$id': 'sid2', 'name': 'Seat 2', 'blockId': 'bid2'},
                {'$id': 'sid1', 'name': 'Seat 1', 'blockId': 'bid1'}
            ];
            var blocks = [
                {'$id': 'bid2', 'displayName': 'Block 2'},
                {'$id': 'bid1', 'displayName': 'Block 1'}
            ];
            var eventName = blockDisplayNameFilter(lock, seats, blocks);
            expect(eventName).toEqual('Block 1');
        });

        it('should return empty string if seat cannot be found', function () {
            var lock = {
                '$id': 'eid1:sid3'
            };
            var seats = [
                {'$id': 'sid2', 'name': 'Seat 2', 'blockId': 'bid2'},
                {'$id': 'sid1', 'name': 'Seat 1', 'blockId': 'bid1'}
            ];
            var blocks = [
                {'$id': 'bid2', 'displayName': 'Block 2'},
                {'$id': 'bid1', 'displayName': 'Block 1'}
            ];
            var eventName = blockDisplayNameFilter(lock, seats, blocks);
            expect(eventName).toEqual('');
        });

        it('should return empty string if block cannot be found', function () {
            var lock = {
                '$id': 'eid1:sid1'
            };
            var seats = [
                {'$id': 'sid2', 'name': 'Seat 2', 'blockId': 'bid2'},
                {'$id': 'sid1', 'name': 'Seat 1', 'blockId': 'bid3'}
            ];
            var blocks = [
                {'$id': 'bid2', 'displayName': 'Block 2'},
                {'$id': 'bid1', 'displayName': 'Block 1'}
            ];
            var eventName = blockDisplayNameFilter(lock, seats, blocks);
            expect(eventName).toEqual('');
        });
    });

    describe('price', function () {
        var price;

        beforeEach(module('ticketbox.components.seatlist', function ($provide) {
            $provide.value('separator', ':');
        }));

        beforeEach(inject(function (_price_) {
            price = _price_;
        }));

        describe('seat()', function() {
            it('should select price from category', function() {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': false
                };
                var seats = [
                    {'$id': 'sid1', 'blockId': 'bid1'}
                ];
                var events = [
                    {'$id': 'eid1', 'blocks': [
                        {'blockId': 'bid1', 'categoryId': 'cid1'}
                    ]}
                ];
                var categories = [
                    {'$id': 'cid1', 'price': 10, 'reducedPrice': 5}
                ];
                var seatPrice = price.seat(lock, seats, events, categories);
                expect(seatPrice).toEqual(10);
            });

            it('should select reduced price from category', function() {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': true
                };
                var seats = [
                    {'$id': 'sid1', 'blockId': 'bid1'}
                ];
                var events = [
                    {'$id': 'eid1', 'blocks': [
                        {'blockId': 'bid1', 'categoryId': 'cid1'}
                    ]}
                ];
                var categories = [
                    {'$id': 'cid1', 'price': 10, 'reducedPrice': 5}
                ];
                var seatPrice = price.seat(lock, seats, events, categories);
                expect(seatPrice).toEqual(5);
            });

            it('should return null if seat cannot be found', function() {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': false
                };
                var seats = [];
                var events = [];
                var categories = [];
                var seatPrice = price.seat(lock, seats, events, categories);
                expect(seatPrice).toEqual(null);
            });

            it('should return null if event cannot be found', function() {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': false
                };
                var seats = [
                    {'$id': 'sid1', 'blockId': 'bid1'}
                ];
                var events = [];
                var categories = [];
                var seatPrice = price.seat(lock, seats, events, categories);
                expect(seatPrice).toEqual(null);
            });

            it('should return null if eventblock cannot be found', function() {
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
                var seatPrice = price.seat(lock, seats, events, categories);
                expect(seatPrice).toEqual(null);
            });

            it('should return null if category cannot be found', function() {
                var lock = {
                    '$id': 'eid1:sid1',
                    'isReduced': false
                };
                var seats = [
                    {'$id': 'sid1', 'blockId': 'bid1'}
                ];
                var events = [
                    {'$id': 'eid1', 'blocks': [
                        {'blockId': 'bid1', 'categoryId': 'cid1'}
                    ]}
                ];
                var categories = [];
                var seatPrice = price.seat(lock, seats, events, categories);
                expect(seatPrice).toEqual(null);
            });
        });
    });

    describe('seatPriceFilter', function () {
        var seatPriceFilter, currency, price;

        beforeEach(function () {
            angular.mock.module('ticketbox.components.seatlist', function ($provide) {
                price = {
                    seat: function() {}
                };
                $provide.value('price', price);

                currency = 'USD';
                $provide.value('CURRENCY', currency);
            });

            inject(function ($filter) {
                seatPriceFilter = $filter('seatPriceFilter', {});
            });
        });

        it('should return price with currency', function() {
            var seatSpy = spyOn(price, 'seat').and.returnValue(10);
            var seatPrice = seatPriceFilter('lock', 'seats', 'events', 'categories');
            expect(seatSpy).toHaveBeenCalledWith('lock', 'seats', 'events', 'categories');
            expect(seatPrice).toEqual('10 ' + currency);
        });

        it('should return empty string if price is null', function() {
            var seatSpy = spyOn(price, 'seat').and.returnValue(null);
            var seatPrice = seatPriceFilter('lock', 'seats', 'events', 'categories');
            expect(seatSpy).toHaveBeenCalledWith('lock', 'seats', 'events', 'categories');
            expect(seatPrice).toEqual('');
        });
    });

    describe('totalPriceFilter', function () {
        var totalPriceFilter, currency, price;

        beforeEach(function () {
            angular.mock.module('ticketbox.components.seatlist', function ($provide) {
                price = {
                    seat: function() {}
                };
                $provide.value('price', price);

                currency = 'USD';
                $provide.value('CURRENCY', currency);
            });

            inject(function ($filter) {
                totalPriceFilter = $filter('totalPriceFilter', {});
            });
        });

        it('should return sum of prices with currency', function() {
            var seatSpy = spyOn(price, 'seat').and.returnValue(10);
            var locks = [ 'lock1', 'lock2', 'lock3' ];
            var totalPrice = totalPriceFilter(locks, 'seats', 'events', 'categories');
            expect(seatSpy).toHaveBeenCalledTimes(3);
            expect(seatSpy).toHaveBeenCalledWith('lock1', 'seats', 'events', 'categories');
            expect(seatSpy).toHaveBeenCalledWith('lock2', 'seats', 'events', 'categories');
            expect(seatSpy).toHaveBeenCalledWith('lock3', 'seats', 'events', 'categories');
            expect(totalPrice).toEqual('30 ' + currency);
        });

        it('should return empty string if at least one price is null', function() {
            var seatSpy = spyOn(price, 'seat').and.returnValue(null);
            var locks = [ 'lock1', 'lock2', 'lock3' ];
            var totalPrice = totalPriceFilter(locks, 'seats', 'events', 'categories');
            expect(seatSpy).toHaveBeenCalledTimes(3);
            expect(seatSpy).toHaveBeenCalledWith('lock1', 'seats', 'events', 'categories');
            expect(seatSpy).toHaveBeenCalledWith('lock2', 'seats', 'events', 'categories');
            expect(seatSpy).toHaveBeenCalledWith('lock3', 'seats', 'events', 'categories');
            expect(totalPrice).toEqual('');
        });
    });
});