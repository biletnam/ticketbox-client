'use strict';

angular.module('ticketbox.customer.checkout', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ticketbox.components.locker',
        'ticketbox.components.mailer',
        'ticketbox.components.seatlist',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/checkout', {
            controller: 'CheckoutCtrl',
            templateUrl: 'customer/checkout/checkout.html'
        });
    }])

    .controller('CheckoutCtrl', function ($rootScope, $scope, $location, $q, fbarray, fbobject, serverValue, locker, mailer, separator, anonymousAuth, messages, error) {
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
            var promises = [];
            _.each($scope.locks, function (lock) {
                lock.orderId = orderRef.key();
                promises.push($scope.locks.$save(lock));
            });

            $q.all(promises).then(function() {
                mailer.order(orderRef.key());
                messages.notify(promises.length + ' seats sold succesfully.');

                anonymousAuth.login().then(function (authData) {
                    $rootScope.authData = authData;
                    $location.path('/events');
                }, error);

            }, error);
        };
    });