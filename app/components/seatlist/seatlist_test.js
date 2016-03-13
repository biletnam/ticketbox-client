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
});