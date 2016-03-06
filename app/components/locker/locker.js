'use strict';

angular.module('ticketbox.components.locker', [ 'ticketbox.components.firebase', 'ticketbox.components.utils' ])

    .service('locker', function(fbref, $rootScope, fbarray, separator, serverValue, error) {
        return {
            lock: function(eventId, seatId) {
                var ref = fbref('/reservations/' + eventId + separator + seatId);
                ref.set({
                    'eventId': eventId,
                    'seatId': seatId,
                    'uid': $rootScope.authData.uid,
                    'timestamp': serverValue.currentTimestamp()
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
            },
            deleteStaleLocks: function() {
                fbarray.byChildValue('/reservations', 'orderId', null).$loaded(function(locks) {
                    _.each(locks, function(lock) {
                        if (lock.timestamp < serverValue.staleTimestamp()) {
                            locks.$remove(lock);
                        }
                    });
                });
            }
        }
    });