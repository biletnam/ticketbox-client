'use strict';

describe('ticketbox.boxoffice.logout', function () {
    var passwordAuth, scope, location, deferred, pathSpy;

    beforeEach(function() {
        module('ticketbox.boxoffice.logout');

        inject(function (_$firebaseObject_, _$rootScope_, _$location_, $controller, $q) {
            scope = _$rootScope_.$new();
            passwordAuth = {
                logout: function(email, pass) { }
            };
            location = _$location_;

            deferred = $q.defer();
            pathSpy = spyOn(location, 'path');

            $controller('LogoutCtrl', {$scope: scope, passwordAuth: passwordAuth, $location: location});
            scope.$digest();
        });
    });

    describe('LogoutCtrl', function() {
        describe('instantiate', function() {
            it('should logout and redirect to login', function() {
                expect(pathSpy).toHaveBeenCalledWith('/login');
            });
        });
    });
});