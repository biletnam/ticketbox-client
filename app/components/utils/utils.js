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
                for (var key in itemsToBeRemoved) {
                    promises.push(items.$remove(itemsToBeRemoved[key]));
                }
                return $q.all(promises);
            }
        }
    })

    .service('error', function($rootScope, $timeout) {
        return function(err) {
            $rootScope.error = angular.isObject(err) && err.code ? err.code : err + '';
            $timeout(function() { $rootScope.error = undefined; }, 2000);
        }
    })

    .service('locker', function(fbref, $rootScope, fbarray, fbobject, separator, error) {
        return {
            lock: function(eventId, seatId) {
                var ref = fbref('/reservations/' + eventId + separator + seatId);
                ref.set({
                    'eventId': eventId,
                    'uid': $rootScope.authData.uid,
                    'timestamp': Firebase.ServerValue.TIMESTAMP
                }, function(e) {
                    if (e) {
                        error(e);
                    }
                });
            },
            unlock: function(eventId, seatId) {
                var ref = fbref('/reservations/' + eventId + separator + seatId);
                ref.remove(function(e) {
                    if (e) {
                        error(e);
                    }
                });
            },
            getMyLocks: function() {
                return fbarray.byChildValue('/reservations', 'uid', $rootScope.authData.uid);
            },
            getLocksOfEvent: function(eventId) {
                return fbarray.byChildValue('/reservations', 'eventId', eventId);
            }
        }
    })

    .filter('nameFilter', function() {
        return function(id, dictionary) {
            var item = _.find(dictionary, function(i) { return i.$id === id; });
            if (item !== undefined) {
                return item.name;
            } else {
                return '';
            }
        }
    });