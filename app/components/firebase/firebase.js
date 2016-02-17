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
            },
            create: function(path, data) {
                return fbref(path).push(data);
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
    })

    .service('anonymousAuth', function(fbauth) {
        return {
            isLoggedIn: function() {
                return !!fbauth.$getAuth();
            },
            getAuthData: function() {
                return fbauth.$getAuth();
            },
            login: function () {
                return fbauth.$authAnonymously();
            }
        };
    });