'use strict';

describe('ticketbox.customer.seats', function () {
    var $firebaseArray, $firebaseObject, $timeout, scope, ref, fbarray, fbobject, byIdSpy, byPathSpy, byChildValueSpy;
    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is the first object'
        },
        'id2': {
            'name': 'This is the second object'
        }
    };

    beforeEach(function () {
        module('ticketbox.customer.seats');

        inject(function (_$firebaseArray_, _$firebaseObject_, _$timeout_, _$rootScope_, _fbarray_, _fbobject_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $firebaseObject = _$firebaseObject_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();

            fbarray = _fbarray_;
            byPathSpy = spyOn(fbarray, 'byPath').and.returnValue(_makeArray(FIXTURE_DATA, ref));
            byChildValueSpy = spyOn(fbarray, 'byChildValue').and.returnValue(_makeArray(FIXTURE_DATA, ref));

            fbobject = _fbobject_;
            byIdSpy = spyOn(fbobject, 'byId').and.returnValue(_makeObject(FIXTURE_DATA, ref));

            var routeParams = {
                eventId: 'eid1',
                blockId: 'bid1',
                categoryId: 'cid1'
            };

            $controller('SeatsCtrl', {$scope: scope, fbarray: fbarray, fbobject: fbobject, $routeParams: routeParams});
            scope.$digest();
        });
    });

    describe('SeatsCtrl', function () {
        describe('$scope.event', function () {
            it('should fetch event', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/events', 'eid1');
            });
        });

        describe('$scope.category', function () {
            it('should fetch category', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/categories', 'cid1');
            });
        });

        describe('$scope.block', function () {
            it('should fetch block', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/blocks', 'bid1');
            });
        });

        describe('$scope.seats', function () {
            it('should fetch seats', function () {
                expect(byChildValueSpy).toHaveBeenCalledWith('/seats', 'blockId', 'bid1');
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

    function _makeObject(initialData, fbref) {
        if (!fbref) {
            fbref = _stubRef();
        }
        var obj = $firebaseObject(fbref);
        if (angular.isDefined(initialData)) {
            fbref.ref().set(initialData);
            fbref.flush();
            $timeout.flush();
        }
        return obj;
    }

    function _stubRef() {
        return new MockFirebase('Mock://');
    }

    function _flush() {
        ref.flush();
        $timeout.flush();
    }
});