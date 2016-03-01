'use strict';

angular.module('ticketbox.boxoffice.orders', ['ticketbox.components.firebase', 'ticketbox.components.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/orders', {
            controller: 'OrdersCtrl',
            templateUrl: 'boxoffice/orders/orders.html'
        });
    }])

    .controller('OrdersCtrl', function ($scope, $location, fbarray) {
        $scope.orders = fbarray.byPath('/orders');
    })

    .filter('status', function() {
        return function(orders, status) {
            return _.filter(orders, function(order) {
                if (status === 'sold' && order.isSold === true) {
                    return true;
                } else if (status === 'pending' && order.isSold !== true) {
                    return true;
                }
                return false;
            })
        }
    });
