'use strict';

angular.module('ticketbox.components.mailer', [ ])

    .service('mailer', function($http, MAILERURL) {
        return {
            order: function(orderId) {
                var data = { 'orderId': orderId };
                return $http.post(MAILERURL + '/order', data);
            },
            sell: function(orderId) {
                var data = { 'orderId': orderId };
                return $http.post(MAILERURL + '/sell', data);
            }
        }
    });