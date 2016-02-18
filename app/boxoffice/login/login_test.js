'use strict';

describe('ticketbox.boxoffice.login', function () {
    var passwordAuth, rootScope, scope, location, deferred;

    beforeEach(function() {
        module('ticketbox.boxoffice.login');

        inject(function (_$firebaseObject_, _$rootScope_, _$location_, $controller, $q) {
            rootScope = _$rootScope_;
            scope = _$rootScope_.$new();
            passwordAuth = {
                login: function(email, pass) { }
            };
            location = _$location_;
            deferred = $q.defer();

            $controller('LoginCtrl', {$rootScope: rootScope, $scope: scope, passwordAuth: passwordAuth, $location: location});
            scope.$digest();
        });
    });

    describe('LoginCtrl', function() {
        describe('$scope.login()', function() {
            it('should define login function', function() {
                expect(typeof scope.login).toBe('function');
            });

            it('should redirect to events on successful login', function() {
                spyOn(passwordAuth, 'login').and.returnValue(deferred.promise);
                var pathSpy = spyOn(location, 'path');

                scope.login('email', 'pass');
                deferred.resolve();
                scope.$apply();

                expect(pathSpy).toHaveBeenCalledWith('/events');
                expect(rootScope.error).toBeUndefined();
            });

            it('should save error to $scope.err', function() {
                spyOn(passwordAuth, 'login').and.returnValue(deferred.promise);
                var pathSpy = spyOn(location, 'path');

                scope.login('email', 'pass');
                deferred.reject('error message');
                scope.$apply();

                expect(pathSpy).not.toHaveBeenCalled();
                expect(rootScope.error).toEqual('error message');
            });
        });
    });
});