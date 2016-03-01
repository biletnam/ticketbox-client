'use strict';

angular.module('ticketbox.customer.checkout', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ticketbox.components.locker',
        'ticketbox.components.seatlist',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/checkout', {
            controller: 'CheckoutCtrl',
            templateUrl: 'customer/checkout/checkout.html'
        });
    }])

    .controller('CheckoutCtrl', function ($rootScope, $scope, $location, fbarray, fbobject, serverValue, locker, separator, anonymousAuth, error) {
        $scope.locks = locker.getMyLocks();
        $scope.events = fbarray.byPath('/events');
        $scope.seats = fbarray.byPath('/seats');
        $scope.blocks = fbarray.byPath('/blocks');

        $scope.unlock = function (lock) {
            var eventId = lock.$id.split(separator)[0];
            var seatId = lock.$id.split(separator)[1];
            locker.unlock(eventId, seatId);
        };

        $scope.checkout = function (firstname, lastname, email) {
            var data = {
                'timestamp': serverValue.currentTimestamp(),
                'firstname': firstname,
                'lastname': lastname,
                'email': email
            };
            var orderRef = fbobject.create('/orders', data);
            _.each($scope.locks, function (lock) {
                lock.orderId = orderRef.key();
                $scope.locks.$save(lock);
            });

            // TODO: Send a confirmation mail

            anonymousAuth.login().then(function (authData) {
                $rootScope.authData = authData;
                $location.path('/events');
            }, error);
        };
    });