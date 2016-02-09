'use strict';

angular.module('ticketbox.components.firebase', ['firebase', 'ticketbox.config'])

    .service('fbref', function(FBURL) {
        return function(path) {
            var firebaseUrl = path === undefined ? FBURL : FBURL + '/' + path;
            var fbref = new Firebase(firebaseUrl);
            return fbref;
        };
    })

    .service('fbarray', function($firebaseArray, fbref) {
        return {
            byPath: function(path) {
                var fbarray = $firebaseArray(fbref(path));
                return fbarray;
            },
            byChildValue: function(path, child, value) {
                var query = fbref(path).orderByChild(child).startAt(value).endAt(value);
                var fbarray = $firebaseArray(query);
                return fbarray;
            }
        }
    })

    .service('fbobject', function($firebaseObject, fbref) {
        return {
            byId: function(path, id) {
                var query = fbref(path + '/' + id);
                var fbobject = $firebaseObject(query);
                return fbobject;
            }
        }
    })

    .service('reservation', function(fbref, $rootScope) {
        return {
            reserve: function(eventId, seatId) {
                var ref = fbref('/events/' + eventId + '/reservations/' + seatId);
                ref.set({
                    'uid': $rootScope.authData.uid,
                    'kind': 'lock',
                    'timestamp': Firebase.ServerValue.TIMESTAMP
                });
            },
            release: function(eventId, seatId) {
                var ref = fbref('/events/' + eventId + '/reservations/' + seatId);
                ref.remove();
            }
        }
    })

    .factory('fbauth', function($firebaseAuth, fbref) {
        return $firebaseAuth(fbref());
    })

    .service('passwordAuth', function(fbauth) {
        return {
            login: function (email, password) {
                var promise = fbauth.$authWithPassword({'email': email, 'password': password});
                return promise;
            },
            logout: function() {
                var promise = fbauth.$unauth();
                return promise;
            }
        };
    });