'use strict';

describe('ticketbox.customer.checkout', function () {
    var $firebaseArray,
        $firebaseObject,
        $timeout,
        scope,
        ref,
        fbarray,
        fbobject,
        serverValue,
        currentTimestampSpy,
        locker,
        saveDeferred,
        locksSaveSpy,
        mailer,
        orderSpy,
        byPathSpy,
        getMyLocksSpy,
        unlockSpy,
        loginDeferred,
        anonymousAuth,
        createSpy,
        loginSpy,
        pathSpy,
        location;
    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is the first object'
        },
        'id2': {
            'name': 'This is the second object'
        }
    };

    beforeEach(function () {
        module('ticketbox.components.utils');
        module('ticketbox.customer.checkout');

        inject(function (_$firebaseArray_, _$firebaseObject_, _$timeout_, _$rootScope_, _fbarray_, _fbobject_, _serverValue_, _locker_, _$q_, _$location_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $firebaseObject = _$firebaseObject_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();

            fbarray = _fbarray_;
            byPathSpy = spyOn(fbarray, 'byPath').and.returnValue(_makeArray(FIXTURE_DATA, ref));

            fbobject = _fbobject_;

            serverValue = _serverValue_;
            currentTimestampSpy = spyOn(serverValue, 'currentTimestamp').and.returnValue(123);

            locker = _locker_;
            var locks = {
                $save: function() {},
                0: {
                    '$id': 'lock0'
                },
                1: {
                    '$id': 'lock1'
                }
            };
            saveDeferred = _$q_.defer();
            locksSaveSpy = spyOn(locks, '$save').and.returnValue(saveDeferred.promise);
            getMyLocksSpy = spyOn(locker, 'getMyLocks').and.returnValue(locks);
            unlockSpy = spyOn(locker, 'unlockWithLock');

            mailer = {
                order: function() { }
            };
            orderSpy = spyOn(mailer, 'order');

            loginDeferred = _$q_.defer();
            anonymousAuth = {
                login: function() {}
            };

            createSpy = spyOn(fbobject, 'create').and.returnValue({
                key: function () {
                    return 'oid1';
                }
            });

            loginSpy = spyOn(anonymousAuth, 'login').and.returnValue(loginDeferred.promise);

            location = _$location_;
            pathSpy = spyOn(location, 'path');

            $controller('CheckoutCtrl', {$scope: scope, fbarray: fbarray, serverValue: serverValue, locker: locker, mailer: mailer, anonymousAuth: anonymousAuth});
            scope.$digest();
        });
    });

    describe('CheckoutCtrl', function () {
        describe('$scope.locks', function () {
            it('should fetch my locks', function () {
                expect(getMyLocksSpy).toHaveBeenCalled();
            });
        });

        describe('$scope.allEvents', function () {
            it('should fetch events', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/events');
            });
        });

        describe('$scope.allSeats', function () {
            it('should fetch seats', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/seats');
            });
        });

        describe('$scope.allBlocks', function () {
            it('should fetch blocks', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/blocks');
            });
        });

        describe('$scope.unlock()', function () {
            it('should unlock given lock', function () {
                var lock = {
                    '$id': 'eid1:sid1'
                };
                expect(unlockSpy).not.toHaveBeenCalled();
                scope.unlock(lock);
                expect(unlockSpy).toHaveBeenCalledWith(lock);
            });
        });

        describe('$scope.checkout()', function () {
            it('should add an order', function () {
                scope.checkout('firstname', 'lastname', 'john.doe@example.com');
                var data = {'timestamp': 123, 'firstname': 'firstname', 'lastname': 'lastname', 'email': 'john.doe@example.com'};
                expect(createSpy).toHaveBeenCalledWith('/orders', data);
                expect(currentTimestampSpy).toHaveBeenCalled();
            });

            it('should add order id to all locks', function () {
                _.each(scope.locks, function (lock) {
                    expect(lock.orderId).toEqual(undefined);
                });
                scope.checkout('firstname', 'lastname', 'john.doe@example.com');
                _.each(scope.locks, function (lock) {
                    expect(lock.orderId).toEqual('oid1');
                });
            });

            it('should send a mail using the mailer', function() {
                expect(orderSpy).not.toHaveBeenCalled();
                scope.checkout('firstname', 'lastname', 'john.doe@example.com');
                expect(locksSaveSpy).toHaveBeenCalled();
                expect(orderSpy).not.toHaveBeenCalled();
                saveDeferred.resolve();
                scope.$digest();
                expect(orderSpy).toHaveBeenCalledWith('oid1');
            });

            it('should renew authentication', function() {
                expect(loginSpy).not.toHaveBeenCalled();
                scope.checkout('firstname', 'lastname', 'john.doe@example.com');
                expect(loginSpy).not.toHaveBeenCalled();
                saveDeferred.resolve();
                scope.$digest();
                expect(loginSpy).toHaveBeenCalled();
            });

            it('should redirect to /events if authentication is successful', function() {
                expect(pathSpy).not.toHaveBeenCalled();
                scope.checkout('firstname', 'lastname', 'john.doe@example.com');
                expect(pathSpy).not.toHaveBeenCalled();
                saveDeferred.resolve();
                loginDeferred.resolve({ 'uid': 'uid' });
                scope.$digest();
                expect(pathSpy).toHaveBeenCalledWith('/events');
            });
        });
    });

    function _makeArray(initialData, fbref) {
        if (!fbref) {
            fbref = _stubRef();
        }
        var fbarray = $firebaseArray(fbref);
        if (angular.isDefined(initialData)) {
            fbref.ref().set(initialData);
            fbref.flush();
            $timeout.flush();
        }
        return fbarray;
    }

    function _stubRef() {
        return new MockFirebase('Mock://');
    }
});