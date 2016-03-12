'use strict';

angular.module('ticketbox.components.seatlist', [ ])

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
    })

    .service('price', function(separator) {
        return {
            seat: function(lock, seats, events, categories) {
                var eventId = lock.$id.split(separator)[0];
                var seatId = lock.$id.split(separator)[1];
                var seat = _.find(seats, function (s) {
                    return s.$id === seatId;
                });
                var event = _.find(events, function(e) {
                    return e.$id === eventId;
                });
                if (seat !== undefined && event !== undefined) {
                    var eventBlock = _.find(event.blocks, function(b) {
                        return b.blockId === seat.blockId;
                    });
                    if (eventBlock !== undefined) {
                        var category = _.find(categories, function(c) {
                            return c.$id === eventBlock.categoryId;
                        });
                        if (category !== undefined) {
                            var price = lock.isReduced ? category.reducedPrice : category.price;
                            return price;
                        }
                    }
                }
                return null;
            }
        }
    })

    .filter('seatPriceFilter', function (price, CURRENCY) {
        return function (lock, seats, events, categories) {
            var seatPrice = price.seat(lock, seats, events, categories);
            if (seatPrice !== null) {
                return seatPrice + ' ' + CURRENCY;
            } else {
                return '';
            }
        }
    })

    .filter('totalPriceFilter', function (price, CURRENCY) {
        return function (locks, seats, events, categories) {
            var totalPrice = 0;
            var isPriceValid = false;
            _.each(locks, function(lock) {
                var seatPrice = price.seat(lock, seats, events, categories);
                if (seatPrice !== null) {
                    totalPrice += seatPrice;
                    isPriceValid = true;
                } else {
                    isPriceValid = false;
                }
            });
            return isPriceValid ? totalPrice + ' ' + CURRENCY : '';
        }
    });