'use strict';

angular.module('ticketbox.customer.checkout', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/checkout', {
            controller: 'CheckoutCtrl',
            templateUrl: 'customer/checkout/checkout.html'
        });
    }])

    .controller('CheckoutCtrl', function ($rootScope, $scope, $location, fbarray, fbobject, locker, separator, anonymousAuth, error) {
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
                'firstname': firstname,
                'lastname': lastname,
                'email': email
            };
            var orderRef = fbobject.create('/orders', data);
            _.each($scope.locks, function (lock) {
                lock.orderId = orderRef.key();
                $scope.locks.$save(lock);
            });

            anonymousAuth.login().then(function (authData) {
                $rootScope.authData = authData;
                $location.path('/events');
            }, error);
        };
    })

    .filter('eventNameFilter', function (separator) {
        return function (lock, events) {
            var eventId = lock.$id.split(separator)[0];
            var event = _.find(events, function (e) {
                return e.$id === eventId;
            });
            if (event !== undefined) {
                return event.name;
            } else {
                return '';
            }
        }
    })

    .filter('seatNameFilter', function (separator) {
        return function (lock, seats) {
            var seatId = lock.$id.split(separator)[1];
            var seat = _.find(seats, function (s) {
                return s.$id === seatId;
            });
            if (seat !== undefined) {
                return seat.name;
            } else {
                return '';
            }
        }
    })

    .filter('blockDisplayNameFilter', function (separator) {
        return function (lock, seats, blocks) {
            var seatId = lock.$id.split(separator)[1];
            var seat = _.find(seats, function (s) {
                return s.$id === seatId;
            });
            if (seat !== undefined) {
                var block = _.find(blocks, function (b) {
                    return b.$id === seat.blockId;
                });
                if (block !== undefined) {
                    return block.displayName;
                } else {
                    return '';
                }
            } else {
                return '';
            }
        }
    });