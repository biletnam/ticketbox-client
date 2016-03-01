'use strict';

angular.module('ticketbox.components.seatlist', [])

    .filter('eventNameFilter', function (separator) {
        return function (lock, events) {
            var eventId = lock.$id.split(separator)[0];
            var event = _.find(events, function (e) {
                return e.$id === eventId;
            });
            if (event !== undefined) {
                return event.name;
            } else {
                return '';
            }
        }
    })

    .filter('seatNameFilter', function (separator) {
        return function (lock, seats) {
            var seatId = lock.$id.split(separator)[1];
            var seat = _.find(seats, function (s) {
                return s.$id === seatId;
            });
            if (seat !== undefined) {
                return seat.name;
            } else {
                return '';
            }
        }
    })

    .filter('blockDisplayNameFilter', function (separator) {
        return function (lock, seats, blocks) {
            var seatId = lock.$id.split(separator)[1];
            var seat = _.find(seats, function (s) {
                return s.$id === seatId;
            });
            if (seat !== undefined) {
                var block = _.find(blocks, function (b) {
                    return b.$id === seat.blockId;
                });
                if (block !== undefined) {
                    return block.displayName;
                } else {
                    return '';
                }
            } else {
                return '';
            }
        }
    });