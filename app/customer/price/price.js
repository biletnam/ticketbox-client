'use strict';

angular.module('ticketbox.customer.price', ['ticketbox.components.price'])

    .filter('seatPriceFilter', function (priceString) {
        return function (lock, seats, events, categories) {
            return priceString.seat(lock, seats, events, categories);
        }
    })

    .filter('totalPriceFilter', function (priceString) {
        return function (locks, seats, events, categories) {
            return priceString.total(locks, seats, events, categories);
        }
    });