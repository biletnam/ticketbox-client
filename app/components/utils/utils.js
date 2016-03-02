'use strict';

angular.module('ticketbox.components.utils', [ 'ticketbox.components.firebase' ])
    .factory('separator', function() {
        return ':';
    })

    .service('arrayModification', function($q) {
        return {
            removeAll: function(items) {
                var itemsToBeRemoved = [];
                _.each(items, function(i) {
                    itemsToBeRemoved.push(i);
                });
                var promises = [];
                _.each(itemsToBeRemoved, function(itemToBeRemoved) {
                    promises.push(items.$remove(itemToBeRemoved));
                });
                return $q.all(promises);
            }
        }
    })

    .service('messages', function($rootScope, $timeout) {
        return {
            notify:  function(message) {
                $rootScope.notification = message;
                $timeout(function() { $rootScope.notification = ''; }, 2000);
            }
        };
    })

    .service('error', function($rootScope, $timeout) {
        return function(err) {
            $rootScope.error = angular.isObject(err) && err.code ? err.code : err + '';
            $timeout(function() { $rootScope.error = undefined; }, 2000);
        }
    })

    .service('serverValue', function() {
        return {
            currentTimestamp: function() {
                return Firebase.ServerValue.TIMESTAMP;
            },
            staleTimestamp: function() {
                return Date.now() - (10 * 60 * 1000);
            }
        };
    })

    .service('coordinates', function() {
        return {
            seatToCoordinates: function(seat) {
                return [
                    { x: seat.x0, y: seat.y0 },
                    { x: seat.x1, y: seat.y1 },
                    { x: seat.x2, y: seat.y2 },
                    { x: seat.x3, y: seat.y3 }
                ];
            }
        };
    })

    .filter('nameFilter', function() {
        return function(id, list) {
            var item = _.find(list, function(i) { return i.$id === id; });
            if (item !== undefined) {
                return item.name;
            } else {
                return '';
            }
        }
    });