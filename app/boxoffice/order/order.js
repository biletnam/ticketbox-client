'use strict';

angular.module('ticketbox.boxoffice.order', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ticketbox.components.locker',
        'ticketbox.components.seatlist',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/order/:orderId', {
            controller: 'OrderCtrl',
            templateUrl: 'boxoffice/order/order.html'
        });
    }])

    .controller('OrderCtrl', function($scope, $routeParams, fbarray, fbobject, locker, separator) {
        $scope.order = fbobject.byId('/orders', $routeParams.orderId);
        $scope.reservations = fbarray.byChildValue('/reservations', 'orderId', $routeParams.orderId);
        $scope.events = fbarray.byPath('/events');
        $scope.seats = fbarray.byPath('/seats');
        $scope.blocks = fbarray.byPath('/blocks');

        $scope.saveReservation = function(reservation) {
            $scope.reservations.$save(reservation);
        };

        $scope.unlock = function (lock) {
            locker.unlockWithLock(lock);
        };

        $scope.sell = function (order, reservations) {
            order.isSold = true;
            order.$save();
            _.each(reservations, function (reservation) {
                reservation.isSold = true;
                reservations.$save(reservation);
            });

            // TODO: Send a confirmation mail
        };
    });