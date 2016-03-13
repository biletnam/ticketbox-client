'use strict';

angular.module('ticketbox.boxoffice.reduction', [ ])

    .service('reductionCalculator', function() {
        return {
            calculateReducedPrice: function(price, event) {
                var relativeReduction = event.relativeBoxofficeReduction;
                var absoluteReduction = event.absoluteBoxofficeReduction;
                return (1 - relativeReduction) * price - absoluteReduction;
            }
        }
    });