'use strict';

angular.module('ticketbox.boxoffice.checkout', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ticketbox.components.locker',
        'ticketbox.components.mailer',
        'ticketbox.components.seatlist',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/checkout', {
            controller: 'CheckoutCtrl',
            templateUrl: 'boxoffice/checkout/checkout.html'
        });
    }])

    .controller('CheckoutCtrl', function ($rootScope, $scope, $location, $q, fbarray, fbobject, serverValue, locker, mailer, separator, messages, error) {
        $scope.locks = locker.getMyLocks();
        $scope.allEvents = fbarray.byPath('/events');
        $scope.allSeats = fbarray.byPath('/seats');
        $scope.allBlocks = fbarray.byPath('/blocks');
        $scope.allCategories = fbarray.byPath('/categories');

        $scope.saveLock = function(lock) {
            $scope.locks.$save(lock);
        };

        $scope.unlock = function (lock) {
            var eventId = lock.$id.split(separator)[0];
            var seatId = lock.$id.split(separator)[1];
            locker.unlock(eventId, seatId);
        };

        $scope.sell = function (email) {
            var data = {
                'timestamp': serverValue.currentTimestamp(),
                'email': email,
                'isSold': true
            };
            var orderRef = fbobject.create('/orders', data);
            var promises = [];
            _.each($scope.locks, function (lock) {
                lock.orderId = orderRef.key();
                lock.isSold = true;
                promises.push($scope.locks.$save(lock));
            });

            $q.all(promises).then(function() {
                mailer.sell(orderRef.key());
                messages.notify('Order processed successfully.');
            }, error);
        };
    });