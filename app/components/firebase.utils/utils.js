'use strict';

angular.module('ticketbox.firebase.utils', ['firebase', 'ticketbox.config'])

    .service('ref', function(FBURL) {
        return function(path) {
            var firebaseUrl = path == '' ? FBURL : FBURL + '/' + path;
            var ref = new Firebase(firebaseUrl);
            return ref;
        };
    })

    .service('sync', function($firebaseObject, ref) {
        return function(path) {
            var syncObject = $firebaseObject(ref(path));
            return syncObject;
        }
    })

    .service('passwordAuth', function(ref) {
        return {
            login: function (email, password) {
                var promise = ref().$authWithPassword({email: email, password: password});
                return promise;
            }
        };
    })

    .factory('auth', function($firebaseAuth, ref) {
        return $firebaseAuth(ref());
    });