'use strict';

angular.module('ticketbox.firebase.utils', ['firebase', 'ticketbox.config'])

    .service('ref', function(FBURL) {
        return function(path) {
            var firebaseUrl = path === undefined ? FBURL : FBURL + '/' + path;
            var ref = new Firebase(firebaseUrl);
            return ref;
        };
    })

    .service('array', function($firebaseArray, ref) {
        return function(path) {
            var array = $firebaseArray(ref(path));
            return array;
        }
    })

    .factory('auth', function($firebaseAuth, ref) {
        return $firebaseAuth(ref());
    })

    .service('passwordAuth', function(auth) {
        return {
            login: function (email, password) {
                var promise = auth.$authWithPassword({'email': email, 'password': password});
                return promise;
            },
            logout: function() {
                var promise = auth.$unauth();
                return promise;
            }
        };
    });