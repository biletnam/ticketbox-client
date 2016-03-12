'use strict';

describe('ticketbox.components.seatlist', function () {
    var currency, eventNameFilter, seatNameFilter, blockDisplayNameFilter, seatPriceFilter;

    beforeEach(function () {
        angular.mock.module('ticketbox.components.seatlist', function ($provide) {
            $provide.value('separator', ':');

            currency = 'USD';
            $provide.value('CURRENCY', currency);
        });

        inject(function ($filter) {
            eventNameFilter = $filter('eventNameFilter', {});
            seatNameFilter = $filter('seatNameFilter', {});
            blockDisplayNameFilter = $filter('blockDisplayNameFilter', {});
            seatPriceFilter = $filter('seatPriceFilter', {});
        });
    });

    describe('eventNameFilter', function () {
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

    describe('seatPriceFilter', function () {
        it('should select price from category and return it with currency', function() {
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
            var price = seatPriceFilter(lock, seats, events, categories);
            expect(price).toEqual('10 ' + currency);
        });

        it('should select reduced price from category and return it with currency', function() {
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
            var price = seatPriceFilter(lock, seats, events, categories);
            expect(price).toEqual('5 ' + currency);
        });

        it('should return empty string if seat cannot be found', function() {
            var lock = {
                '$id': 'eid1:sid1',
                'isReduced': false
            };
            var seats = [];
            var events = [];
            var categories = [];
            var price = seatPriceFilter(lock, seats, events, categories);
            expect(price).toEqual('');
        });

        it('should return empty string if event cannot be found', function() {
            var lock = {
                '$id': 'eid1:sid1',
                'isReduced': false
            };
            var seats = [
                {'$id': 'sid1', 'blockId': 'bid1'}
            ];
            var events = [];
            var categories = [];
            var price = seatPriceFilter(lock, seats, events, categories);
            expect(price).toEqual('');
        });

        it('should return empty string if eventblock cannot be found', function() {
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
            var price = seatPriceFilter(lock, seats, events, categories);
            expect(price).toEqual('');
        });

        it('should return empty string if category cannot be found', function() {
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
            var price = seatPriceFilter(lock, seats, events, categories);
            expect(price).toEqual('');
        });
    });
});