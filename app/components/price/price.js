'use strict';

angular.module('ticketbox.components.price', [ ])

    .service('priceCalculator', function(separator) {
        return {
            calculate: function(lock, seats, events, categories, reductionCalculator) {
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
                            if (reductionCalculator !== undefined) {
                                return reductionCalculator.calculateReducedPrice(price, event);
                            } else {
                                return price;
                            }
                        }
                    }
                }
                return null;
            }
        }
    })

    .service('priceString', function (priceCalculator, CURRENCY) {
        return {
            seat: function (lock, seats, events, categories, reductionCalculator) {
                var seatPrice = priceCalculator.calculate(lock, seats, events, categories, reductionCalculator);
                if (seatPrice !== null) {
                    return seatPrice + ' ' + CURRENCY;
                } else {
                    return '';
                }
            },
            total: function (locks, seats, events, categories, reductionCalculator) {
                var totalPrice = 0;
                var isPriceValid = false;
                _.each(locks, function (lock) {
                    var seatPrice = priceCalculator.calculate(lock, seats, events, categories, reductionCalculator);
                    if (seatPrice !== null) {
                        totalPrice += seatPrice;
                        isPriceValid = true;
                    } else {
                        isPriceValid = false;
                    }
                });
                return isPriceValid ? totalPrice + ' ' + CURRENCY : '';
            }
        };
    });