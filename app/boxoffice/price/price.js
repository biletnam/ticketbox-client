'use strict';

angular.module('ticketbox.boxoffice.price', ['ticketbox.components.price', 'ticketbox.boxoffice.reduction'])

    .filter('seatPriceFilter', function (priceString, reductionCalculator) {
        return function (lock, seats, events, categories) {
            return priceString.seat(lock, seats, events, categories, reductionCalculator);
        }
    })

    .filter('totalPriceFilter', function (priceString, reductionCalculator) {
        return function (locks, seats, events, categories) {
            return priceString.total(locks, seats, events, categories, reductionCalculator);
        }
    });